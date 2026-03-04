import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  pricing: string | null;
  sort_order: number | null;
  summary?: string | null;
  cover_image_url?: string | null;
  packages?: any[] | null;
  gallery_images?: string[] | null;
  slug?: string | null;
}

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", icon: "Camera", pricing: "",
    summary: "", cover_image_url: "", packages_text: "", gallery_text: "",
  });
  const { toast } = useToast();

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    if (data) setServices(data.map((s: any) => s));
  };

  useEffect(() => { fetchServices(); }, []);

  const toSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", description: "", icon: "Camera", pricing: "", summary: "", cover_image_url: "", packages_text: "", gallery_text: "" });
    setDialogOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      title: s.title,
      description: s.description || "",
      icon: s.icon || "Camera",
      pricing: s.pricing || "",
      summary: (s as any).summary || "",
      cover_image_url: (s as any).cover_image_url || "",
      packages_text: JSON.stringify((s as any).packages || [], null, 2),
      gallery_text: ((s as any).gallery_images || []).join("\n"),
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    let packages: any[] = [];
    try { packages = JSON.parse(form.packages_text || "[]"); } catch { /* ignore */ }
    const gallery_images = form.gallery_text.split("\n").map(s => s.trim()).filter(Boolean);

    const payload: any = {
      title: form.title,
      description: form.description,
      icon: form.icon,
      pricing: form.pricing,
      summary: form.summary,
      cover_image_url: form.cover_image_url,
      packages,
      gallery_images,
      slug: toSlug(form.title),
    };

    if (editing) {
      await supabase.from("services").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("services").insert(payload);
    }
    setDialogOpen(false);
    toast({ title: editing ? "Updated!" : "Added!" });
    fetchServices();
  };

  const del = async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    toast({ title: "Deleted!" });
    fetchServices();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Services</h1>
        <Button onClick={openAdd}><Plus className="mr-1 h-4 w-4" /> Add Service</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                  {s.pricing && <p className="text-sm text-primary mt-1">{s.pricing}</p>}
                  {(s as any).summary && <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">{(s as any).summary}</p>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Edit2 className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => del(s.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title *</Label>
              <Input placeholder="e.g. Wedding Photography" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Icon (Lucide name)</Label>
              <Input placeholder="Camera, Heart, Baby..." value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Summary (2-3 lines)</Label>
              <Textarea placeholder="Short summary shown on service page" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} />
            </div>
            <div>
              <Label className="text-xs">Full Description</Label>
              <Textarea placeholder="Detailed description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
            </div>
            <div>
              <Label className="text-xs">Pricing</Label>
              <Input placeholder="e.g. ₹5,000 - ₹25,000" value={form.pricing} onChange={(e) => setForm({ ...form, pricing: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Cover Image URL</Label>
              <Input placeholder="https://... or /images/..." value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Gallery Images (one URL per line)</Label>
              <Textarea
                placeholder={"/images/gallery/wedding-1.png\n/images/gallery/wedding-2.png"}
                value={form.gallery_text}
                onChange={(e) => setForm({ ...form, gallery_text: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label className="text-xs">Packages (JSON array)</Label>
              <Textarea
                placeholder={'[\n  { "name": "Basic", "price": "₹5000", "features": ["2 hours", "50 photos"] }\n]'}
                value={form.packages_text}
                onChange={(e) => setForm({ ...form, packages_text: e.target.value })}
                rows={4}
                className="font-mono text-xs"
              />
            </div>
            <Button className="w-full bg-gold-gradient" onClick={save}>{editing ? "Update" : "Add"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesManagement;
