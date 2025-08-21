import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
    Globe,
    MapPin,
    Plane,
    Building2,
    Route,
    Calendar,
    Menu,
    X,
    LogOut,
} from "lucide-react";
import { Link, Outlet } from "react-router";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const menuItems = [
    { href: "/country", label: "Countries", icon: Globe },
    { href: "/city", label: "Cities", icon: MapPin },
    { href: "/airport", label: "Airports", icon: Building2 },
    { href: "/airplane", label: "Airplanes", icon: Plane },
    { href: "/flight-cycle", label: "Flight Cycles", icon: Route },
    { href: "/flight", label: "Flights", icon: Calendar },
];

export function Sidebar({
    isCollapsed,
    onToggleCollapse,
    isMobileOpen,
    onMobileToggle,
    admin,
}) {
    const location = useLocation();
    const pathname = location.pathname;

    if (!admin) {
        window.location.href = "/login";
    }
    const handleLogout = async (e) => {
        try {
            let res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/admin/logout`
            );
            res = await res.json();
            if (res.ok) window.location.href = "/login";
            toast.success(res.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            {/* Mobile hamburger button */}
            <Button
                variant="ghost"
                size="sm"
                className="md:hidden cursor-pointer fixed top-4 left-4 z-50 bg-background border "
                onClick={() => onMobileToggle(!isMobileOpen)}
            >
                {isMobileOpen ? (
                    <X className="h-4 w-4" />
                ) : (
                    <Menu className="h-4 w-4" />
                )}
            </Button>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => onMobileToggle(!isMobileOpen)}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
                    "fixed top-0 left-0 z-40 h-full",
                    isMobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0",
                    // Desktop styles
                    isCollapsed ? "md:w-16" : "md:w-64",
                    "w-64" // Fixed width on mobile
                )}
            >
                <div className="p-4 border-b border-sidebar-border flex-shrink-0">
                    <div className="flex items-center justify-between">
                        {!isCollapsed && (
                            <div>
                                <h1 className="text-lg font-bold text-sidebar-foreground">
                                    Flight Admin
                                </h1>
                                <p className="text-xs text-sidebar-foreground/70">
                                    Manage your flight data
                                </p>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hidden md:flex cursor-pointer"
                            onClick={() => onToggleCollapse(!isCollapsed)}
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-hidden">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => isMobileOpen && onMobileToggle()}
                            >
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    className={cn(
                                        "w-full cursor-pointer justify-start gap-3 text-sm h-10 transition-all",
                                        isActive
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                        isCollapsed &&
                                            "md:justify-center md:gap-0"
                                    )}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <Icon className="h-4 w-4 flex-shrink-0" />
                                    {(!isCollapsed || isMobileOpen) && (
                                        <span className="truncate">
                                            {item.label}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        );
                    })}
                    {!isCollapsed && <div
                        onClick={handleLogout}
                        className="flex gap-2 mt-2 items-center px-3 cursor-pointer"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="truncate font-semibold text-sm">Logout</span>
                    </div>}
                </nav>
            </div>
            <div
                className={cn(
                    "transition-all duration-300",
                    isCollapsed ? "md:ml-16" : "md:ml-64",
                    "ml-0" // No margin on mobile
                )}
            >
                <Outlet />
            </div>
        </>
    );
}
