"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Clock,
  Layers,
  LogOut,
  MapPin,
  Package,
  Plus,
  Search,
  Shirt,
  Tag,
  Truck,
  Users,
} from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { clearTokens } from "@/lib/auth";
import { CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Types aligned with defaultdb SQL schema ---
interface VariantRow {
  variant_id: number;
  product_name: string;
  product_brand: string;
  category_name: string;
  category_section: string;
  product_gender: string;
  size_name: string;
  color_name: string;
  color_hex: string;
  variant_stock_quantity: number;
  variant_location: string;
  variant_status: "In Stock" | "Low Stock" | "Out of Stock";
  variant_last_restock_date: string;
}

interface PurchaseOrderRow {
  purchase_order_id: number;
  supplier_name: string;
  employee_name: string;
  purchase_order_date: string;
  purchase_expected_date: string;
  purchase_order_status: "Received" | "In Transit" | "Pending";
  items_ordered: number;
  items_received: number;
}

// --- Sample Data reflecting defaultdb tables (ready to swap with API fetch) ---
const SAMPLE_VARIANTS: VariantRow[] = [
  {
    variant_id: 101,
    product_name: "Essential Heavyweight Tee",
    product_brand: "CloThBasics",
    category_name: "Tops",
    category_section: "Casualwear",
    product_gender: "Unisex",
    size_name: "L",
    color_name: "Terracotta Clay",
    color_hex: "#C2410C",
    variant_stock_quantity: 48,
    variant_location: "Rack A-01 · Shelf 2",
    variant_status: "In Stock",
    variant_last_restock_date: "2026-11-08",
  },
  {
    variant_id: 102,
    product_name: "Tailored Pleated Trousers",
    product_brand: "Atelier Manila",
    category_name: "Bottoms",
    category_section: "Formalwear",
    product_gender: "Women",
    size_name: "M",
    color_name: "Obsidian Black",
    color_hex: "#040606",
    variant_stock_quantity: 7,
    variant_location: "Rack B-04 · Rail 1",
    variant_status: "Low Stock",
    variant_last_restock_date: "2026-10-29",
  },
  {
    variant_id: 103,
    product_name: "Raw Selvedge Denim Jacket",
    product_brand: "NorthThread",
    category_name: "Outerwear",
    category_section: "Denim",
    product_gender: "Men",
    size_name: "XL",
    color_name: "Mustard Ochre",
    color_hex: "#EAB308",
    variant_stock_quantity: 19,
    variant_location: "Rack C-02 · Hanging",
    variant_status: "In Stock",
    variant_last_restock_date: "2026-11-10",
  },
  {
    variant_id: 104,
    product_name: "Linen Relaxed Button-Down",
    product_brand: "Isla Loom",
    category_name: "Tops",
    category_section: "Resort",
    product_gender: "Unisex",
    size_name: "S",
    color_name: "Warm Cream",
    color_hex: "#EAE0C8",
    variant_stock_quantity: 0,
    variant_location: "Rack A-03 · Shelf 1",
    variant_status: "Out of Stock",
    variant_last_restock_date: "2026-10-15",
  },
  {
    variant_id: 105,
    product_name: "Structured Midi A-Line Skirt",
    product_brand: "Atelier Manila",
    category_name: "Bottoms",
    category_section: "Formalwear",
    product_gender: "Women",
    size_name: "S",
    color_name: "Terracotta Clay",
    color_hex: "#C2410C",
    variant_stock_quantity: 6,
    variant_location: "Rack B-02 · Rail 2",
    variant_status: "Low Stock",
    variant_last_restock_date: "2026-11-02",
  },
  {
    variant_id: 106,
    product_name: "Everyday Ribbed Sando",
    product_brand: "CloThBasics",
    category_name: "Tops",
    category_section: "Essentials",
    product_gender: "Women",
    size_name: "M",
    color_name: "Obsidian Black",
    color_hex: "#040606",
    variant_stock_quantity: 64,
    variant_location: "Rack A-02 · Bin 4",
    variant_status: "In Stock",
    variant_last_restock_date: "2026-11-11",
  },
];

const SAMPLE_ORDERS: PurchaseOrderRow[] = [
  {
    purchase_order_id: 408,
    supplier_name: "Manila Textile Mills Corp.",
    employee_name: "Hazel Paradela",
    purchase_order_date: "2026-11-09",
    purchase_expected_date: "2026-11-15",
    purchase_order_status: "In Transit",
    items_ordered: 120,
    items_received: 0,
  },
  {
    purchase_order_id: 407,
    supplier_name: "Cebu Garment Weavers",
    employee_name: "Marco Reyes",
    purchase_order_date: "2026-11-04",
    purchase_expected_date: "2026-11-11",
    purchase_order_status: "Received",
    items_ordered: 85,
    items_received: 85,
  },
  {
    purchase_order_id: 409,
    supplier_name: "Luzon Apparel Distributors",
    employee_name: "Hazel Paradela",
    purchase_order_date: "2026-11-12",
    purchase_expected_date: "2026-11-19",
    purchase_order_status: "Pending",
    items_ordered: 60,
    items_received: 0,
  },
];

function ClothRackLogo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg
        viewBox="0 0 310 88"
        className="h-11 w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="CloThRACK Logo"
      >
        {/* Hanger hook & shoulders */}
        <path
          d="M126 18C126 11.5 135 11 135 17.5C135 21 130 23 130 26.5M130 26.5C116 33 96 36 82 37.5C77 38 77 43 83 42.5M130 26.5C144 33 164 36 178 37.5"
          stroke="#040606"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Wordmark */}
        <text
          x="10"
          y="72"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="44"
          fontWeight="700"
          letterSpacing="-1"
        >
          <tspan fill="#C2410C">Clo</tspan>
          <tspan fill="#040606">T</tspan>
          <tspan fill="#C2410C">h</tspan>
          <tspan fill="#040606">RACK</tspan>
        </text>
        {/* Continuous garment rack rail line */}
        <path
          d="M14 77C95 75 215 75 294 77C301 77 302 68 293 66C260 58 232 39 178 37.5"
          stroke="#040606"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { isChecking } = useAuthGuard({ requireAuth: true });

  const [activeNav, setActiveNav] = useState<
    "overview" | "racks" | "orders" | "directory"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "In Stock" | "Low Stock" | "Out of Stock"
  >("All");

  const filteredVariants = useMemo(() => {
    return SAMPLE_VARIANTS.filter((item) => {
      const matchesStatus =
        statusFilter === "All" || item.variant_status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.product_name.toLowerCase().includes(q) ||
        item.product_brand.toLowerCase().includes(q) ||
        item.variant_location.toLowerCase().includes(q) ||
        item.category_name.toLowerCase().includes(q) ||
        item.color_name.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [searchQuery, statusFilter]);

  const metrics = useMemo(() => {
    const totalUnits = SAMPLE_VARIANTS.reduce(
      (sum, v) => sum + v.variant_stock_quantity,
      0
    );
    const lowOrOut = SAMPLE_VARIANTS.filter(
      (v) => v.variant_status !== "In Stock"
    ).length;
    const openOrders = SAMPLE_ORDERS.filter(
      (o) => o.purchase_order_status !== "Received"
    ).length;
    return {
      totalSkus: SAMPLE_VARIANTS.length,
      totalUnits,
      lowOrOut,
      openOrders,
    };
  }, []);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF7E6] text-[#040606]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-[#C2410C] border-t-transparent" />
          <p className="text-sm font-medium tracking-wide text-[#040606]/70">
            Verifying CloThRACK session...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    clearTokens();
    router.push(CONFIG.ROUTES.LOGIN);
  };

  const scrollToSection = (
    tab: "overview" | "racks" | "orders" | "directory",
    elementId: string
  ) => {
    setActiveNav(tab);
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7E6] text-[#040606] selection:bg-[#EAB308]/40">
      {/* =====================================================================
          UPPER CURVE HERO HEADER (Hanger Silhouette + Cloth / Track / Rack)
      ====================================================================== */}
      <div className="relative overflow-hidden bg-[#f5f5dc] border-b border-[#040606]/10">
        {/* Subtle decorative apparel outlines */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.06]"
        >
          <Shirt className="absolute left-12 top-24 size-24 -rotate-12 text-[#C2410C]" />
          <Tag className="absolute right-20 top-28 size-20 rotate-12 text-[#040606]" />
          <Layers className="absolute bottom-14 left-1/4 size-16 rotate-6 text-[#EAB308]" />
        </div>

        {/* Top Navbar */}
        <header className="relative z-20 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 pt-5 pb-2">
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("overview", "overview");
            }}
            className="focus-visible:outline-none"
          >
            <ClothRackLogo />
          </a>

          {/* Center Shadcn Navigation Buttons */}
          <nav
            aria-label="Dashboard sections"
            className="flex flex-wrap items-center gap-1.5 rounded-full border border-[#040606]/15 bg-[#FFF7E6]/90 p-1.5 shadow-xs backdrop-blur-xs"
          >
            {[
              { id: "overview", label: "Overview", target: "overview" },
              { id: "racks", label: "Inventory & Racks", target: "rack-table" },
              { id: "orders", label: "Purchase Orders", target: "orders-section" },
              { id: "directory", label: "Suppliers & Staff", target: "directory-section" },
            ].map((item) => {
              const active = activeNav === item.id;
              return (
                <Button
                  key={item.id}
                  type="button"
                  variant={active ? "default" : "ghost"}
                  size="sm"
                  onClick={() =>
                    scrollToSection(
                      item.id as "overview" | "racks" | "orders" | "directory",
                      item.target
                    )
                  }
                  className={
                    active
                      ? "rounded-full bg-[#C2410C] px-4 text-xs font-semibold text-[#FFF7E6] hover:bg-[#C2410C]/90"
                      : "rounded-full px-4 text-xs font-medium text-[#040606]/80 hover:bg-[#EAB308]/25 hover:text-[#040606]"
                  }
                >
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="rounded-full border-[#040606]/25 bg-[#FFF7E6] px-4 text-xs font-semibold text-[#040606] transition-colors hover:border-[#C2410C] hover:bg-[#C2410C] hover:text-[#FFF7E6]"
          >
            <LogOut className="mr-1.5 size-3.5" />
            Logout
          </Button>
        </header>

        {/* Center Hero Banner Inside the Upper Curve */}
        <div
          id="overview"
          className="relative z-10 mx-auto max-w-4xl px-6 pt-6 pb-24 text-center sm:pb-28"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C2410C]/30 bg-[#FFF7E6] px-3.5 py-1 text-xs font-semibold tracking-wide text-[#C2410C]">
            <span className="size-2 rounded-full bg-[#EAB308]" />
            CLOTH · TRACK · RACK SYSTEM
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#040606] sm:text-5xl">
            Every <span className="text-[#C2410C]">Cloth</span> Accounted For,{" "}
            <span className="underline decoration-[#EAB308] decoration-4 underline-offset-4">
              Tracked
            </span>{" "}
            to the Exact <span className="text-[#C2410C]">Rack</span>.
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#040606]/75 sm:text-base">
            Real-time stock visibility across categories, sizes, colorways,
            aisle locations, and inbound supplier restocks.
          </p>

          {/* Quick Pill Highlights */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#040606]/15 bg-[#FFF7E6] px-3.5 py-1.5">
              <Shirt className="size-3.5 text-[#C2410C]" />
              <strong>Cloth:</strong> 3 Active Categories
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#040606]/15 bg-[#FFF7E6] px-3.5 py-1.5">
              <Truck className="size-3.5 text-[#EAB308]" />
              <strong>Track:</strong> {metrics.openOrders} Inbound Orders
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#040606]/15 bg-[#FFF7E6] px-3.5 py-1.5">
              <MapPin className="size-3.5 text-[#C2410C]" />
              <strong>Rack:</strong> Zones A, B &amp; C Mapped
            </span>
          </div>
        </div>

        {/* SVG Architectural Hanger-Swoop Curve Divider (matching Canva sketch) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full overflow-hidden leading-none"
        >
          <svg
            viewBox="0 0 1440 150"
            className="h-16 w-full sm:h-24"
            preserveAspectRatio="none"
          >
            {/* Cream fill below the hanger curve */}
            <path
              d="M0,135 L210,28 Q720,175 1230,28 L1440,135 L1440,150 L0,150 Z"
              fill="#FFF7E6"
            />
            {/* Crisp Obsidian outline tracing the hanger silhouette */}
            <path
              d="M0,135 L210,28 Q720,175 1230,28 L1440,135"
              fill="none"
              stroke="#040606"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* =====================================================================
          MAIN SCROLLABLE DASHBOARD WORKSPACE
      ====================================================================== */}
      <main className="mx-auto max-w-7xl space-y-8 px-6 pt-4 pb-16">
        {/* 1. KPI Summary Row (Grounded in product, product_variant, purchase_order) */}
        <section
          aria-label="Inventory metrics"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="border-[#040606]/15 bg-[#f5f5dc]/75 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-[#040606]/70">
                Total Rack Units
              </CardDescription>
              <div className="rounded-lg bg-[#C2410C]/15 p-2 text-[#C2410C]">
                <Boxes className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#040606]">
                {metrics.totalUnits}
              </div>
              <p className="mt-1 text-xs text-[#040606]/65">
                Across {metrics.totalSkus} tracked product variants
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#040606]/15 bg-[#f5f5dc]/75 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-[#040606]/70">
                Active Apparel SKUs
              </CardDescription>
              <div className="rounded-lg bg-[#EAB308]/25 p-2 text-[#040606]">
                <Shirt className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#040606]">
                {metrics.totalSkus}
              </div>
              <p className="mt-1 text-xs text-[#040606]/65">
                Tops, Bottoms &amp; Outerwear catalog
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#C2410C]/35 bg-[#f5f5dc]/75 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-[#C2410C]">
                Restock Alerts
              </CardDescription>
              <div className="rounded-lg bg-[#C2410C] p-2 text-[#FFF7E6]">
                <AlertTriangle className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#C2410C]">
                {metrics.lowOrOut}
              </div>
              <p className="mt-1 text-xs text-[#040606]/65">
                Variants low or out on floor racks
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#040606]/15 bg-[#f5f5dc]/75 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-[#040606]/70">
                Inbound Purchase Orders
              </CardDescription>
              <div className="rounded-lg bg-[#040606] p-2 text-[#EAB308]">
                <ClipboardList className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#040606]">
                {metrics.openOrders}
              </div>
              <p className="mt-1 text-xs text-[#040606]/65">
                Awaiting delivery from suppliers
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 2. Product Variant & Rack Location Table (product + category + sizes + color + product_variant) */}
        <section id="rack-table" className="scroll-mt-6">
          <Card className="border-[#040606]/15 bg-[#f5f5dc]/60 shadow-xs">
            <CardHeader className="border-b border-[#040606]/10 pb-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <CardTitle className="text-xl font-bold text-[#040606]">
                    Product Variants &amp; Rack Locations
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs text-[#040606]/70">
                    Live stock breakdown mapped to physical rack coordinates,
                    sizes, and colorways.
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="bg-[#C2410C] text-xs font-semibold text-[#FFF7E6] hover:bg-[#C2410C]/90"
                  >
                    <Plus className="mr-1.5 size-3.5" />
                    Add Variant
                  </Button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap gap-1.5">
                  {(["All", "In Stock", "Low Stock", "Out of Stock"] as const).map(
                    (status) => {
                      const isSelected = statusFilter === status;
                      return (
                        <Button
                          key={status}
                          type="button"
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => setStatusFilter(status)}
                          className={
                            isSelected
                              ? "h-8 rounded-md bg-[#040606] px-3 text-xs font-medium text-[#FFF7E6] hover:bg-[#040606]/90"
                              : "h-8 rounded-md border-[#040606]/20 bg-[#FFF7E6] px-3 text-xs font-medium text-[#040606] hover:bg-[#EAB308]/25"
                          }
                        >
                          {status}
                        </Button>
                      );
                    }
                  )}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#040606]/50" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cloth, rack, brand, color..."
                    className="h-8 border-[#040606]/20 bg-[#FFF7E6] pl-8 text-xs text-[#040606] placeholder:text-[#040606]/45 focus-visible:border-[#C2410C] focus-visible:ring-[#C2410C]/25"
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#040606]/[0.04]">
                    <TableRow className="border-[#040606]/10 hover:bg-transparent">
                      <TableHead className="text-xs font-bold text-[#040606]">
                        Product &amp; Brand
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#040606]">
                        Category
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#040606]">
                        Size &amp; Color
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#040606]">
                        Rack Location
                      </TableHead>
                      <TableHead className="text-right text-xs font-bold text-[#040606]">
                        Stock Qty
                      </TableHead>
                      <TableHead className="text-xs font-bold text-[#040606]">
                        Status
                      </TableHead>
                      <TableHead className="text-right text-xs font-bold text-[#040606]">
                        Last Restock
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredVariants.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-10 text-center text-sm text-[#040606]/60"
                        >
                          No apparel variants match your current filter.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVariants.map((row) => (
                        <TableRow
                          key={row.variant_id}
                          className="border-[#040606]/10 transition-colors hover:bg-[#FFF7E6]/80"
                        >
                          <TableCell className="font-medium">
                            <div className="text-sm font-semibold text-[#040606]">
                              {row.product_name}
                            </div>
                            <div className="text-xs text-[#040606]/60">
                              {row.product_brand} · {row.product_gender}
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="inline-flex items-center rounded-md border border-[#040606]/15 bg-[#FFF7E6] px-2 py-0.5 text-xs font-medium">
                              {row.category_name}
                            </span>
                            <div className="mt-0.5 text-[11px] text-[#040606]/55">
                              {row.category_section}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2 text-xs font-medium">
                              <span className="inline-flex size-6 items-center justify-center rounded border border-[#040606]/20 bg-[#FFF7E6] font-bold">
                                {row.size_name}
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <span
                                  className="size-3 rounded-full border border-[#040606]/30"
                                  style={{ backgroundColor: row.color_hex }}
                                />
                                {row.color_name}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C]">
                              <MapPin className="size-3.5 shrink-0" />
                              {row.variant_location}
                            </span>
                          </TableCell>

                          <TableCell className="text-right font-mono text-sm font-bold">
                            {row.variant_stock_quantity}
                          </TableCell>

                          <TableCell>
                            {row.variant_status === "In Stock" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#040606] px-2.5 py-0.5 text-[11px] font-semibold text-[#FFF7E6]">
                                <CheckCircle2 className="size-3 text-[#EAB308]" />
                                In Stock
                              </span>
                            )}
                            {row.variant_status === "Low Stock" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#EAB308] px-2.5 py-0.5 text-[11px] font-bold text-[#040606]">
                                <AlertTriangle className="size-3" />
                                Low Stock
                              </span>
                            )}
                            {row.variant_status === "Out of Stock" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#C2410C] px-2.5 py-0.5 text-[11px] font-semibold text-[#FFF7E6]">
                                Out of Stock
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="text-right text-xs text-[#040606]/70">
                            {row.variant_last_restock_date}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 3. Purchase Orders & Supplier/Employee Tracking Grid */}
        <section
          id="orders-section"
          className="grid scroll-mt-6 gap-6 lg:grid-cols-3"
        >
          {/* Purchase Orders (purchase_order + product_purchase + supplier + employee) */}
          <Card className="border-[#040606]/15 bg-[#f5f5dc]/60 shadow-xs lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#040606]/10 pb-4">
              <div>
                <CardTitle className="text-lg font-bold">
                  Purchase Orders &amp; Restock Tracking
                </CardTitle>
                <CardDescription className="text-xs text-[#040606]/70">
                  Inbound shipments linked to suppliers and assigned staff
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-[#040606]/20 bg-[#FFF7E6] text-xs font-semibold hover:bg-[#EAB308]/25"
              >
                New Order
                <ArrowUpRight className="ml-1 size-3.5" />
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#040606]/[0.04]">
                  <TableRow className="border-[#040606]/10 hover:bg-transparent">
                    <TableHead className="text-xs font-bold text-[#040606]">
                      PO #
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#040606]">
                      Supplier
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#040606]">
                      Handled By
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#040606]">
                      Expected Date
                    </TableHead>
                    <TableHead className="text-right text-xs font-bold text-[#040606]">
                      Units (Rcv/Ord)
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#040606]">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_ORDERS.map((po) => (
                    <TableRow
                      key={po.purchase_order_id}
                      className="border-[#040606]/10 hover:bg-[#FFF7E6]/80"
                    >
                      <TableCell className="font-mono text-xs font-bold text-[#C2410C]">
                        #PO-{po.purchase_order_id}
                      </TableCell>
                      <TableCell className="text-xs font-semibold">
                        {po.supplier_name}
                      </TableCell>
                      <TableCell className="text-xs text-[#040606]/75">
                        {po.employee_name}
                      </TableCell>
                      <TableCell className="text-xs text-[#040606]/75">
                        {po.purchase_expected_date}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-semibold">
                        {po.items_received}/{po.items_ordered}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            po.purchase_order_status === "Received"
                              ? "inline-flex items-center gap-1 rounded-full bg-[#040606] px-2.5 py-0.5 text-[11px] font-semibold text-[#FFF7E6]"
                              : po.purchase_order_status === "In Transit"
                              ? "inline-flex items-center gap-1 rounded-full bg-[#EAB308] px-2.5 py-0.5 text-[11px] font-bold text-[#040606]"
                              : "inline-flex items-center gap-1 rounded-full border border-[#C2410C]/40 bg-[#C2410C]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#C2410C]"
                          }
                        >
                          <Clock className="size-3" />
                          {po.purchase_order_status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Suppliers & Active Staff Summary (supplier + employee tables) */}
          <Card
            id="directory-section"
            className="scroll-mt-6 border-[#040606]/15 bg-[#f5f5dc]/60 shadow-xs"
          >
            <CardHeader className="border-b border-[#040606]/10 pb-4">
              <CardTitle className="text-lg font-bold">
                Suppliers &amp; Floor Staff
              </CardTitle>
              <CardDescription className="text-xs text-[#040606]/70">
                Verified partners &amp; active inventory personnel
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                  <Package className="size-3.5" />
                  Active Suppliers
                </div>
                {[
                  {
                    name: "Manila Textile Mills Corp.",
                    location: "Quezon City · Active",
                  },
                  {
                    name: "Cebu Garment Weavers",
                    location: "Mandaue City · Active",
                  },
                  {
                    name: "Luzon Apparel Distributors",
                    location: "Makati City · Active",
                  },
                ].map((sup) => (
                  <div
                    key={sup.name}
                    className="flex items-center justify-between rounded-lg border border-[#040606]/10 bg-[#FFF7E6] px-3 py-2"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#040606]">
                        {sup.name}
                      </div>
                      <div className="text-[11px] text-[#040606]/60">
                        {sup.location}
                      </div>
                    </div>
                    <span className="size-2 rounded-full bg-[#EAB308]" />
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 border-t border-[#040606]/10 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#040606]">
                  <Users className="size-3.5 text-[#C2410C]" />
                  Staff on Duty
                </div>
                {[
                  {
                    name: "Hazel Paradela",
                    role: "Inventory Lead · Active",
                  },
                  {
                    name: "Marco Reyes",
                    role: "Stock Coordinator · Active",
                  },
                ].map((emp) => (
                  <div
                    key={emp.name}
                    className="flex items-center justify-between rounded-lg border border-[#040606]/10 bg-[#FFF7E6] px-3 py-2"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#040606]">
                        {emp.name}
                      </div>
                      <div className="text-[11px] text-[#040606]/60">
                        {emp.role}
                      </div>
                    </div>
                    <span className="rounded bg-[#C2410C]/15 px-2 py-0.5 text-[10px] font-bold text-[#C2410C]">
                      On Shift
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}