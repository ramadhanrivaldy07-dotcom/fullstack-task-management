import { useEffect, useState } from "react";
import api from "../services/api";

function Tasks({ onLogout }) {
    const [tasks, setTasks] = useState([]);
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "pending"
    });

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const [editingTask, setEditingTask] = useState(null);

    const handleEdit = (task) => {
        setEditingTask(task);

        setForm({
            title: task.title,
            description: task.description || "",
            status: task.status
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const controller = new AbortController();

        const loadTasks = async () => {
            try {
                const response = await api.get("/tasks", {
                    params: {
                        ...(status && { status }),
                        ...(debouncedSearch && {
                            search: debouncedSearch
                        })
                    },
                    signal: controller.signal
                });

                setTasks(response.data.data);
            } catch (error) {
                if (error.code !== "ERR_CANCELED") {
                    setError(
                        error.response?.data?.message ||
                        "Failed to load tasks"
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadTasks();

        return () => controller.abort();
    }, [status, debouncedSearch, refreshKey]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError("");
            setIsSaving(true);

            if (editingTask) {
                await api.put(
                    `/tasks/${editingTask.id}`,
                    form
                );
            } else {
                await api.post(
                    "/tasks",
                    form
                );
            }

            setForm({
                title: "",
                description: "",
                status: "pending"
            });

            setEditingTask(null);
            setLoading(true);
            setRefreshKey((current) => current + 1);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save task"
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setDeletingId(id);

            await api.delete(`/tasks/${id}`);
            setLoading(true);
            setRefreshKey((current) => current + 1);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        } finally {
            setDeletingId(null);
        }
    };

    const handleLogout = () => {
        onLogout();
    };

    

   return (
         <div className="container py-5">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Task Management</h1>
                    <p className="text-secondary mb-0">
                        Manage your daily tasks
                    </p>
                </div>

                <button
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="card shadow-sm mb-4">
                <div className="card-body">

                    <h5 className="card-title mb-3">
                        {editingTask
                            ? "Edit Task"
                            : "Create New Task"}
                    </h5>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">

                            <div className="col-md-4">
                                <label className="form-label" htmlFor="task-title">
                                    Title
                                </label>

                                <input
                                    id="task-title"
                                    className="form-control"
                                    type="text"
                                    name="title"
                                    placeholder="Task title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label" htmlFor="task-description">
                                    Description
                                </label>

                                <input
                                    id="task-description"
                                    className="form-control"
                                    type="text"
                                    name="description"
                                    placeholder="Task description"
                                    value={form.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label" htmlFor="task-status">
                                    Status
                                </label>

                                <select
                                    id="task-status"
                                    className="form-select"
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                >
                                    <option value="pending">
                                        Pending
                                    </option>
                                    <option value="in-progress">
                                        In Progress
                                    </option>
                                    <option value="done">
                                        Done
                                    </option>
                                </select>
                            </div>

                            <div className="col-md-2 d-flex align-items-end gap-2">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={isSaving}
                                >
                                    {isSaving
                                        ? "Saving..."
                                        : editingTask
                                        ? "Update"
                                        : "Add"}
                                </button>

                                {editingTask && (
                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        disabled={isSaving}
                                        onClick={() => {
                                            setEditingTask(null);

                                            setForm({
                                                title: "",
                                                description: "",
                                                status: "pending"
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                        </div>
                    </form>
                </div>
            </div>

            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-3">
                <h4 className="mb-0">My Tasks</h4>

                <div className="d-flex flex-wrap align-items-end gap-2">
                    <div>
                        <label
                            className="form-label"
                            htmlFor="task-search"
                        >
                            Search
                        </label>
                        <div className="input-group">
                            <input
                                id="task-search"
                                className="form-control"
                                type="search"
                                placeholder="Search task title"
                                value={search}
                                onChange={(event) => {
                                    setError("");
                                    setLoading(true);
                                    setSearch(event.target.value);
                                }}
                            />
                            {search && (
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => {
                                        setError("");
                                        setLoading(true);
                                        setSearch("");
                                    }}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            className="form-label"
                            htmlFor="task-filter"
                        >
                            Filter
                        </label>
                        <select
                            id="task-filter"
                            className="form-select"
                            value={status}
                            onChange={(event) => {
                                setError("");
                                setLoading(true);
                                setStatus(event.target.value);
                            }}
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">
                                In Progress
                            </option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="text-center py-4" role="status">
                    Loading...
                </div>
            )}

            {!loading && tasks.length === 0 && (
                <div className="alert alert-secondary">
                    {debouncedSearch
                        ? `No tasks found for "${debouncedSearch}".`
                        : "No tasks found."}
                </div>
            )}

            <div className="row g-3">
                {tasks.map((task) => (
                    <div
                        className="col-md-6 col-lg-4"
                        key={task.id}
                    >
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">

                                <div className="d-flex justify-content-between">
                                    <h5 className="card-title">
                                        {task.title}
                                    </h5>

                                    <span
                                        className={
                                            task.status === "done"
                                                ? "badge bg-success"
                                                : task.status === "in-progress"
                                                ? "badge bg-warning text-dark"
                                                : "badge bg-secondary"
                                        }
                                    >
                                        {task.status}
                                    </span>
                                </div>

                                <p className="card-text text-secondary">
                                    {task.description ||
                                        "No description"}
                                </p>

                            </div>

                            <div className="card-footer bg-transparent border-0 d-flex gap-2">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() =>
                                        handleEdit(task)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    disabled={deletingId === task.id}
                                    onClick={() =>
                                        handleDelete(task.id)
                                    }
                                >
                                    {deletingId === task.id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Tasks;
