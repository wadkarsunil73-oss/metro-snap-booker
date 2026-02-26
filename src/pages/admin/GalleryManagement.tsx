import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, X } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string | null;
  file_url: string;
  file_type: string;
  category_id: string | null;
  sort_order: number | null;
}

interface Category {
  id: string;
  name: string;
}

const GalleryManagement = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const fetchData = async () => {
    const [gRes, cRes] = await Promise.all([
      supabase.from("gallery_items").select("*").order("sort_order"),
      supabase.from("categories").select("*"),
    ]);
    if (gRes.data) setItems(gRes.data);
    if (cRes.data) setCategories(cRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const isVideo = file.type.startsWith("video/");

      const { error: uploadError } = await supabase.storage.from("gallery").upload(filePath, file);
      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        continue;
      }

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(filePath);

      await supabase.from("gallery_items").insert({
        file_url: urlData.publicUrl,
        file_type: isVideo ? "video" : "photo",
        title: file.name,
        category_id: selectedCategory !== "all" ? selectedCategory : null,
      });
    }

    setUploading(false);
    toast({ title: "Upload complete!" });
    fetchData();
    e.target.value = "";
  };

  const handleDelete = async (item: GalleryItem) => {
    // Extract file path from URL
    const urlParts = item.file_url.split("/gallery/");
    if (urlParts[1]) {
      await supabase.storage.from("gallery").remove([urlParts[1]]);
    }
    await supabase.from("gallery_items").delete().eq("id", item.id);
    toast({ title: "Deleted" });
    fetchData();
  };

  const handleCategoryChange = async (itemId: string, categoryId: string) => {
    await supabase.from("gallery_items").update({ category_id: categoryId === "none" ? null : categoryId }).eq("id", itemId);
    fetchData();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Gallery Management</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="cursor-pointer">
          <Button asChild disabled={uploading}>
            <span>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Photos/Videos"}
            </span>
          </Button>
          <Input
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items
          .filter((i) => selectedCategory === "all" || i.category_id === selectedCategory)
          .map((item) => (
            <Card key={item.id} className="relative group overflow-hidden">
              {item.file_type === "video" ? (
                <video src={item.file_url} className="w-full h-48 object-cover" />
              ) : (
                <img src={item.file_url} alt={item.title || ""} className="w-full h-48 object-cover" loading="lazy" />
              )}
              <div className="p-3 space-y-2">
                <Select
                  value={item.category_id || "none"}
                  onValueChange={(v) => handleCategoryChange(item.id, v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Set category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Category</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDelete(item)}>
                  <Trash2 className="mr-1 h-3 w-3" /> Delete
                </Button>
              </div>
            </Card>
          ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-muted-foreground mt-12">No gallery items yet. Upload your first photo or video!</p>
      )}
    </div>
  );
};

export default GalleryManagement;
