import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Plus, Bell, Package, Check, AlertTriangle, X, Search, ArrowUpDown, LayoutGrid, List, Pencil, TrendingUp, Trash, Sparkles, Image, Tag, DollarSign, FileText, PlusCircle, UploadCloud, ImagePlus } from "lucide-react";
import { ngn } from "@/data/products";
import useAdmin, { type Product } from "@/store/admin";
import { useMemo, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const stats = [
  { l: "Total Products", v: "68", d: "+5 this week", i: Package, c: "text-blue-600 bg-blue-50" },
  { l: "Active Listings", v: "54", d: "+3", i: Check, c: "text-emerald-600 bg-emerald-50" },
  { l: "Low Stock", v: "7", d: "+2", i: AlertTriangle, c: "text-amber-600 bg-amber-50" },
  { l: "Out of Stock", v: "7", d: "+1", i: X, c: "text-red-600 bg-red-50" },
];

type SortMode = "best" | "name" | "priceAsc" | "priceDesc";
type StatusFilter = "all" | "active" | "low" | "out";

export default function AdminProducts() {
  const products = useAdmin((s) => s.products);
  const addProduct = useAdmin((s) => s.addProduct);
  const editProduct = useAdmin((s) => s.editProduct);
  const deleteProduct = useAdmin((s) => s.deleteProduct);
  const [cat, setCat] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("Misc");
  const [stock, setStock] = useState("In Stock");
  const [shortDescription, setShortDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("best");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDragging, setIsDragging] = useState(false);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // File input refs
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category)))], [products]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    const next = products.filter((product) => {
      const matchesCategory = cat === "All" || product.category === cat;
      const matchesQuery = !normalizedQuery || `${product.name} ${product.shortDescription} ${product.category}`.toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" && product.stock === "In Stock") || (statusFilter === "low" && product.stock === "Low Stock") || (statusFilter === "out" && product.stock === "Out of Stock");
      return matchesCategory && matchesQuery && matchesStatus;
    });

    switch (sortMode) {
      case "name":
        next.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "priceAsc":
        next.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        next.sort((a, b) => b.price - a.price);
        break;
      default:
        next.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
    }

    return next;
  }, [cat, products, query, sortMode, statusFilter]);

  const resetForm = () => {
    setName("");
    setPrice(0);
    setCategory("Misc");
    setStock("In Stock");
    setShortDescription("");
    setImages([]);
    setImageFiles([]);
  };

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) return;

    const newImageUrls = validFiles.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImageUrls]);
    setImageFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // Reset input value so the same file can be selected again
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newImages;
    });
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const submitAdd = () => {
    if (!name.trim()) return;
    const id = "p-" + Math.random().toString(36).slice(2, 8);
    
    // In production, you'd upload imageFiles to a server and get back URLs
    // For now, we'll use the blob URLs as placeholders
    addProduct({
      id,
      name: name.trim(),
      price,
      image: images[0] || "",
      images: images,
      category: category || "Misc",
      shortDescription: shortDescription.trim(),
      stock,
      sold: 0,
      sizes: [{ label: "Regular" }],
    } as any);
    resetForm();
    setAddOpen(false);
  };

  const submitEdit = () => {
    if (!editing) return;
    editProduct(editing.id, { 
      name: name.trim(), 
      price, 
      category, 
      stock, 
      shortDescription: shortDescription.trim(), 
      image: images[0] || "",
      images: images,
    } as any);
    setEditing(null);
    setEditOpen(false);
    resetForm();
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setStock(product.stock);
    setShortDescription(product.shortDescription);
    setImages((product as any).images || (product.image ? [product.image] : []));
    setImageFiles([]);
    setEditOpen(true);
  };

  const confirmDelete = (product: Product) => {
    setDeleteTarget(product);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
    setDeleteOpen(false);
  };

  const sortLabel = sortMode === "best" ? "Best Selling" : sortMode === "name" ? "Name" : sortMode === "priceAsc" ? "Price ↑" : "Price ↓";

  const stockColor: Record<string, string> = {
    "In Stock": "text-emerald-600",
    "Low Stock": "text-amber-600",
    "Out of Stock": "text-red-600",
  };

  const stockDotColor: Record<string, string> = {
    "In Stock": "bg-emerald-500",
    "Low Stock": "bg-amber-500",
    "Out of Stock": "bg-red-500",
  };

  const stockBadgeColor: Record<string, string> = {
    "In Stock": "bg-emerald-500 text-white",
    "Low Stock": "bg-amber-500 text-white",
    "Out of Stock": "bg-red-500 text-white",
  };

  const renderProductForm = (isEdit: boolean = false) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b px-4 sm:px-6 py-4 sm:py-5 shrink-0">
        <SheetHeader className="space-y-1 sm:space-y-1.5 p-0">
          <SheetTitle className="text-lg sm:text-xl font-bold tracking-tight">
            {isEdit ? "Edit Product" : "Add New Product"}
          </SheetTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isEdit ? "Update product details" : "Create a new product listing for your catalog"}
          </p>
        </SheetHeader>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-7">
        {/* Image Upload Section */}
        <div className="space-y-3">
          <Label className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
            <Image className="h-3.5 w-3.5 text-muted-foreground" />
            Product Images
            {images.length > 0 && (
              <Badge variant="secondary" className="text-[10px]">{images.length}</Badge>
            )}
          </Label>
          
          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              const inputRef = isEdit ? editFileInputRef : addFileInputRef;
              inputRef.current?.click();
            }}
            className={`
              relative rounded-2xl border-2 border-dashed p-4 sm:p-6 transition-all cursor-pointer
              ${isDragging 
                ? 'border-brand bg-brand/5 scale-[1.02] shadow-lg' 
                : images.length > 0 
                  ? 'border-muted-foreground/20 hover:border-brand/50 hover:bg-secondary/30' 
                  : 'border-muted-foreground/30 hover:border-brand hover:bg-brand/5'
              }
            `}
          >
            <input
              ref={isEdit ? editFileInputRef : addFileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
            />

            {isDragging ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="grid h-14 w-14 rounded-full bg-brand/10 place-items-center">
                  <UploadCloud className="h-7 w-7 text-brand animate-bounce" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-brand">Drop your images here</p>
                  <p className="text-xs text-muted-foreground">Release to upload</p>
                </div>
              </div>
            ) : images.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-secondary border-2 border-muted-foreground/20">
                      <img src={url} alt={`Product ${idx + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(idx);
                        }}
                        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-red-500 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      {idx === 0 && (
                        <Badge className="absolute bottom-1.5 left-1.5 bg-black/70 text-white border-0 text-[10px]">
                          Cover
                        </Badge>
                      )}
                      {imageFiles[idx] && (
                        <div className="absolute bottom-1.5 right-1.5">
                          <Badge className="bg-emerald-500 text-white border-0 text-[9px]">
                            New
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ImagePlus className="h-3.5 w-3.5" />
                  <span>Click to add more images</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6 sm:py-8">
                <div className="grid h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-muted place-items-center">
                  <UploadCloud className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold">Upload product images</p>
                  <p className="text-xs text-muted-foreground">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    PNG, JPG, WEBP up to 5MB each
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {images.length > 0 && (
            <p className="text-[10px] sm:text-[11px] text-muted-foreground">
              {images.length} image{images.length > 1 ? 's' : ''} selected · First image is used as cover
            </p>
          )}
        </div>

        <hr className="border-border" />

        {/* Form fields */}
        <div className="space-y-4 sm:space-y-5">
          {/* Product Name */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor={isEdit ? "edit-name" : "prod-name"} className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              Product Name
            </Label>
            <Input
              id={isEdit ? "edit-name" : "prod-name"}
              placeholder="e.g. Chocolate Milkshake"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              className="h-10 sm:h-11 text-sm focus-visible:ring-brand"
            />
          </div>

          {/* Price & Category - Responsive Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor={isEdit ? "edit-price" : "prod-price"} className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Price (₦)
              </Label>
              <div className="relative">
                <Input
                  id={isEdit ? "edit-price" : "prod-price"}
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e: any) => setPrice(Number(e.target.value))}
                  className="h-10 sm:h-11 pl-10 text-sm focus-visible:ring-brand"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">₦</span>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor={isEdit ? "edit-category" : "prod-category"} className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                Category
              </Label>
              <Input
                id={isEdit ? "edit-category" : "prod-category"}
                placeholder="e.g. Milkshakes"
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="h-10 sm:h-11 text-sm focus-visible:ring-brand"
              />
            </div>
          </div>

          {/* Stock Status */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor={isEdit ? "edit-stock" : "prod-stock"} className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-muted-foreground" />
              Stock Status
            </Label>
            <div className="relative">
              <select
                id={isEdit ? "edit-stock" : "prod-stock"}
                className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 appearance-none cursor-pointer"
                value={stock}
                onChange={(e: any) => setStock(e.target.value)}
              >
                <option value="In Stock">🟢 In Stock</option>
                <option value="Low Stock">🟡 Low Stock</option>
                <option value="Out of Stock">🔴 Out of Stock</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" />
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5">
              {["In Stock", "Low Stock", "Out of Stock"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStock(s)}
                  className={`flex items-center gap-1.5 rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-medium transition-all border ${
                    stock === s
                      ? "border-brand bg-brand/10 text-brand shadow-sm"
                      : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${stockDotColor[s]}`} />
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor={isEdit ? "edit-desc" : "prod-desc"} className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Short Description
            </Label>
            <textarea
              id={isEdit ? "edit-desc" : "prod-desc"}
              className="min-h-[80px] sm:min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 resize-none"
              placeholder="A brief description of the product..."
              value={shortDescription}
              onChange={(e: any) => setShortDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Summary card */}
        <div className="rounded-xl border bg-accent/30 p-3 sm:p-4 space-y-2 sm:space-y-3">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Preview</p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <div>
              <span className="text-muted-foreground">Name</span>
              <p className="font-bold text-xs sm:text-sm truncate">{name.trim() || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Price</span>
              <p className="font-bold text-xs sm:text-sm">{price > 0 ? ngn(price) : "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Category</span>
              <p className="font-bold text-xs sm:text-sm">{category || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Stock</span>
              <p className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${stockDotColor[stock]}`} />
                {stock}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Images</span>
              <p className="font-bold text-xs sm:text-sm">
                {images.length > 0 ? `${images.length} image${images.length > 1 ? 's' : ''} selected` : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 bg-muted/30 shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            // Clean up object URLs before closing
            images.forEach(url => URL.revokeObjectURL(url));
            if (isEdit) { setEditing(null); setEditOpen(false); } 
            else setAddOpen(false);
            resetForm();
          }} 
          className="text-muted-foreground text-xs sm:text-sm"
        >
          Cancel
        </Button>
        <div className="flex items-center gap-2 sm:gap-3">
          <p className="text-[10px] sm:text-[11px] text-muted-foreground hidden lg:block">
            {!name.trim() ? "Enter product name" : images.length === 0 ? "Add at least one image" : "Ready to save"}
          </p>
          <Button
            onClick={isEdit ? submitEdit : submitAdd}
            disabled={!name.trim() || images.length === 0}
            className="gap-1.5 sm:gap-2 rounded-full text-xs sm:text-sm"
            size="sm"
          >
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {isEdit ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Products</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage your catalog · {products.length} products · Last updated today</p>
        </div>
        <div className="flex gap-1.5 sm:gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10"><Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></Button>
          <Button variant="outline" className="gap-1.5 sm:gap-2 text-xs sm:text-sm hidden sm:inline-flex"><Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Export</Button>
          <Button variant="outline" className="gap-1.5 sm:gap-2 text-xs sm:text-sm hidden sm:inline-flex"><Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Import</Button>
          
          {/* ADD PRODUCT SHEET */}
          <Sheet open={addOpen} onOpenChange={(open) => {
            if (!open) {
              // Clean up object URLs when sheet is closed
              images.forEach(url => URL.revokeObjectURL(url));
              resetForm();
            }
            setAddOpen(open);
          }}>
            <SheetTrigger asChild>
              <Button className="gap-1.5 sm:gap-2 rounded-full text-xs sm:text-sm"><Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Add Product</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[460px] md:w-[480px] lg:w-[500px] p-0 [&>button]:hidden">
              {/* Custom close button */}
              <button
                onClick={() => {
                  images.forEach(url => URL.revokeObjectURL(url));
                  setAddOpen(false);
                  resetForm();
                }}
                className="absolute top-4 right-4 z-50 grid h-8 w-8 rounded-full bg-background border shadow-sm place-items-center hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              {renderProductForm(false)}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* EDIT PRODUCT SHEET */}
      <Sheet open={editOpen} onOpenChange={(open) => {
        if (!open) {
          images.forEach(url => URL.revokeObjectURL(url));
          setEditing(null);
          resetForm();
        }
        setEditOpen(open);
      }}>
        <SheetContent side="right" className="w-full sm:w-[460px] md:w-[480px] lg:w-[500px] p-0 [&>button]:hidden">
          {/* Custom close button */}
          <button
            onClick={() => {
              images.forEach(url => URL.revokeObjectURL(url));
              setEditing(null);
              setEditOpen(false);
              resetForm();
            }}
            className="absolute top-4 right-4 z-50 grid h-8 w-8 rounded-full bg-background border shadow-sm place-items-center hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          {renderProductForm(true)}
        </SheetContent>
      </Sheet>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader className="space-y-3">
            <div className="mx-auto grid h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-red-100 place-items-center">
              <Trash className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center text-base sm:text-lg">Delete Product</DialogTitle>
            <DialogDescription className="text-center text-xs sm:text-sm">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">"{deleteTarget?.name}"</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="rounded-xl border bg-muted/30 p-3 flex items-center gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                {(deleteTarget as any)?.images?.[0] || (deleteTarget as any)?.image ? (
                  <img src={(deleteTarget as any).images?.[0] || (deleteTarget as any).image} alt={deleteTarget.name} className="h-full w-full object-cover" />
                ) : (
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs sm:text-sm truncate">{deleteTarget.name}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{ngn(deleteTarget.price)} · {deleteTarget.category}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button variant="outline" onClick={() => { setDeleteTarget(null); setDeleteOpen(false); }} className="rounded-full text-xs sm:text-sm">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-1.5 sm:gap-2 rounded-full text-xs sm:text-sm">
              <Trash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border bg-card p-3 sm:p-5">
            <div className="flex justify-between"><div className={`grid h-8 w-8 sm:h-10 sm:w-10 rounded-xl place-items-center ${s.c}`}><s.i className="h-4 w-4 sm:h-5 sm:w-5" /></div><Badge className="border-0 text-[10px] bg-emerald-50 text-emerald-700"><TrendingUp className="h-2.5 w-2.5 mr-0.5" />{s.d}</Badge></div>
            <div className="mt-2 sm:mt-4 text-2xl sm:text-3xl font-extrabold">{s.v}</div>
            <div className="text-[11px] sm:text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-3 sm:p-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-1">
          {categories.map((t) => (
            <button key={t} onClick={() => setCat(t)} className={`flex items-center gap-1.5 sm:gap-2 rounded-full border px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium transition ${cat === t ? "border-brand bg-brand text-brand-foreground shadow-sm" : "border-border hover:border-brand hover:bg-secondary/60"}`}>
              {t}
              <Badge variant="secondary" className={`h-3.5 sm:h-4 text-[10px] ${cat === t ? "bg-white/20 text-current" : ""}`}>{t === "All" ? products.length : products.filter((p) => p.category === t).length}</Badge>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <div className="relative"><Search className="absolute left-2.5 top-2.5 h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" /><Input placeholder="Search..." className="pl-7 sm:pl-8 h-8 sm:h-9 w-36 sm:w-48 md:w-56 text-xs sm:text-sm" value={query} onChange={(e: any) => setQuery(e.target.value)} /></div>
          <select value={statusFilter} onChange={(e: any) => setStatusFilter(e.target.value)} className="h-8 sm:h-9 rounded-full border border-input bg-background px-2 sm:px-3 text-[11px] sm:text-sm shadow-sm">
            <option value="all">All stock</option>
            <option value="active">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
          <Button variant="outline" size="sm" className="gap-1 text-[11px] sm:text-xs h-8 sm:h-9" onClick={() => setSortMode((current) => current === "best" ? "name" : current === "name" ? "priceAsc" : current === "priceAsc" ? "priceDesc" : "best")}><ArrowUpDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {sortLabel}</Button>
          <div className="flex overflow-hidden rounded-full border">
            <Button variant="ghost" size="icon" className={`h-8 w-8 sm:h-9 sm:w-9 rounded-none ${viewMode === "grid" ? "bg-secondary" : ""}`} onClick={() => setViewMode("grid")}><LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></Button>
            <Button variant="ghost" size="icon" className={`h-8 w-8 sm:h-9 sm:w-9 rounded-none ${viewMode === "list" ? "bg-secondary" : ""}`} onClick={() => setViewMode("list")}><List className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></Button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((p) => {
            const productImages = (p as any).images || (p.image ? [p.image] : []);
            const displayImage = productImages[0] || "";
            return (
              <div key={p.id} className="rounded-2xl border bg-card overflow-hidden card-elevated group/card">
                <div className="relative aspect-square bg-secondary">
                  <img src={displayImage} alt={p.name} className="h-full w-full object-cover" />
                  <Badge className="absolute top-3 left-3 bg-white text-foreground border">{p.category}</Badge>
                  {productImages.length > 1 && (
                    <Badge className="absolute top-3 right-3 bg-black/60 text-white border-0 text-[10px]">
                      +{productImages.length - 1}
                    </Badge>
                  )}
                  <Badge className={`absolute top-3 right-3 border-0 ${stockBadgeColor[p.stock]} ${productImages.length > 1 ? 'mt-7' : ''}`}>
                    {p.stock === "In Stock" ? "Active" : p.stock === "Out of Stock" ? "Out of Stock" : "Low Stock"}
                  </Badge>
                  <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-7 w-7 bg-white/90 shadow-md" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="secondary" className="h-7 w-7 bg-white/90 shadow-md" onClick={() => confirmDelete(p)}><Trash className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
                <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                  <div className="font-semibold leading-tight line-clamp-1 text-sm">{p.name}</div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 min-h-[1.5rem]">{p.shortDescription}</p>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-brand text-sm">{ngn(p.price)}</div>
                    <div className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3 text-emerald-600" /> {p.sold} sold</div>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-t">
                    <div className="flex gap-1">{(p.sizes ?? [{ label: "Regular" }]).slice(0, 3).map((s) => <Badge key={s.label} variant="outline" className="text-[10px]">{s.label[0]}</Badge>)}</div>
                    <div className={`text-[11px] sm:text-xs font-semibold flex items-center gap-1 ${stockColor[p.stock]}`}>● {p.stock}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="grid grid-cols-[1.3fr_0.7fr_0.5fr_0.4fr] gap-3 border-b bg-secondary/30 px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Product</span><span>Category</span><span>Stock</span><span>Action</span>
          </div>
          {filtered.map((p) => (
            <div key={p.id} className="grid grid-cols-[1.3fr_0.7fr_0.5fr_0.4fr] gap-3 items-center border-b px-3 sm:px-4 py-2 sm:py-3 last:border-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                  {((p as any).images?.[0] || p.image) ? (
                    <img src={(p as any).images?.[0] || p.image} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs sm:text-sm truncate">{p.name}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">{ngn(p.price)}</div>
                </div>
              </div>
              <div className="text-[11px] sm:text-sm">{p.category}</div>
              <div className="text-[11px] sm:text-sm font-medium flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${stockDotColor[p.stock]}`} />
                {p.stock}
              </div>
              <div className="flex gap-1 sm:gap-2">
                <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => openEdit(p)}><Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => confirmDelete(p)}><Trash className="h-3 w-3 sm:h-3.5 sm:w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-[11px] sm:text-xs text-muted-foreground">Showing {filtered.length} of {products.length} products</div>
        <div className="flex gap-1">{["‹", "1", "2", "3", "...", "9", "›"].map((p) => <button key={p} className={`min-w-6 sm:min-w-7 h-6 sm:h-7 rounded-md text-[10px] sm:text-xs font-semibold ${p === "1" ? "bg-brand text-brand-foreground" : "hover:bg-secondary"}`}>{p}</button>)}</div>
      </div>
    </div>
  );
}