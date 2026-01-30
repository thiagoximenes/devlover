import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Loader2, FolderKanban, ListTodo } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Client {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  client_id: string;
  created_at: string;
  clients: { name: string } | null;
  tasks_count?: number;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  project_id: string;
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    client_id: "",
  });

  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    due_date: "",
  });

  useEffect(() => {
    if (user) {
      fetchClients();
      fetchProjects();
    }
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("clients")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name");
    setClients(data || []);
  };

  const fetchProjects = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("projects")
      .select("*, clients(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar projetos");
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const fetchTasks = async (projectId: string) => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    setTasks(data || []);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "active",
      client_id: "",
    });
    setEditingProject(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || "",
      status: project.status,
      client_id: project.client_id,
    });
    setDialogOpen(true);
  };

  const openTasksDialog = (project: Project) => {
    setSelectedProject(project);
    fetchTasks(project.id);
    setTaskDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.client_id) return;

    setSaving(true);

    const projectData = {
      user_id: user.id,
      name: formData.name,
      description: formData.description || null,
      status: formData.status,
      client_id: formData.client_id,
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingProject.id);

        if (error) throw error;
        toast.success("Projeto atualizado!");
      } else {
        const { error } = await supabase.from("projects").insert(projectData);
        if (error) throw error;
        toast.success("Projeto criado!");
      }

      setDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      toast.error("Erro ao salvar projeto");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProject) return;

    setSaving(true);

    try {
      const { error } = await supabase.from("tasks").insert({
        user_id: user.id,
        project_id: selectedProject.id,
        title: taskFormData.title,
        description: taskFormData.description || null,
        status: taskFormData.status as "todo" | "in_progress" | "done",
        due_date: taskFormData.due_date || null,
      });

      if (error) throw error;
      toast.success("Tarefa adicionada!");
      setTaskFormData({ title: "", description: "", status: "todo", due_date: "" });
      fetchTasks(selectedProject.id);
    } catch (error) {
      toast.error("Erro ao adicionar tarefa");
    } finally {
      setSaving(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: status as "todo" | "in_progress" | "done" })
      .eq("id", taskId);

    if (error) {
      toast.error("Erro ao atualizar tarefa");
    } else {
      if (selectedProject) {
        fetchTasks(selectedProject.id);
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
      toast.error("Erro ao excluir tarefa");
    } else {
      toast.success("Tarefa excluída!");
      if (selectedProject) {
        fetchTasks(selectedProject.id);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir projeto");
    } else {
      toast.success("Projeto excluído!");
      fetchProjects();
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clients?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    const labels: Record<string, string> = {
      active: "Ativo",
      completed: "Concluído",
      cancelled: "Cancelado",
    };
    return <Badge variant={variants[status] || "secondary"}>{labels[status] || status}</Badge>;
  };

  const getTaskStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      todo: "outline",
      in_progress: "default",
      done: "secondary",
    };
    const labels: Record<string, string> = {
      todo: "A fazer",
      in_progress: "Em andamento",
      done: "Concluído",
    };
    return <Badge variant={variants[status] || "secondary"}>{labels[status] || status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projetos</h1>
          <p className="text-muted-foreground">Gerencie seus projetos e tarefas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Editar Projeto" : "Novo Projeto"}
              </DialogTitle>
              <DialogDescription>Preencha os dados do projeto</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, client_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome do Projeto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingProject ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar projetos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="w-[150px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm
                        ? "Nenhum projeto encontrado"
                        : "Nenhum projeto cadastrado"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{project.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{project.clients?.name || "-"}</TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell>
                      {format(new Date(project.created_at), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openTasksDialog(project)}
                        >
                          <ListTodo className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(project)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tasks Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tarefas - {selectedProject?.name}</DialogTitle>
            <DialogDescription>Gerencie as tarefas deste projeto</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddTask} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="taskTitle">Nova tarefa</Label>
              <Input
                id="taskTitle"
                value={taskFormData.title}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, title: e.target.value })
                }
                placeholder="Título da tarefa"
              />
            </div>
            <Button type="submit" disabled={saving || !taskFormData.title}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>

          <div className="space-y-2 mt-4">
            {tasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma tarefa neste projeto
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div>{getTaskStatusBadge(task.status)}</div>
                    <span
                      className={
                        task.status === "done" ? "line-through text-muted-foreground" : ""
                      }
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Select
                      value={task.status}
                      onValueChange={(value) => updateTaskStatus(task.id, value)}
                    >
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">A fazer</SelectItem>
                        <SelectItem value="in_progress">Em andamento</SelectItem>
                        <SelectItem value="done">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
