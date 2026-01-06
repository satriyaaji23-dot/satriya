"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, History, ArrowRight, LogOut, Calendar, ClipboardCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export default function DashboardPage() {
    const { user, logout } = useAuth()

    const mahasiswaMenu = [
        {
            title: "Peminjaman Baru",
            description: "Ajukan peminjaman ruangan atau alat untuk kegiatan.",
            icon: PlusCircle,
            href: "/loan/new",
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            title: "Riwayat Saya",
            description: "Lihat status dan riwayat peminjaman Anda.",
            icon: History,
            href: "/loan/new?tab=history",
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
        },
    ]

    const adminMenu = [
        {
            title: "Jadwal Ruangan",
            description: "Cek ketersediaan ruangan.",
            icon: Calendar,
            href: "/loan/new?tab=grid",
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            title: "Daftar Persetujuan",
            description: "Konfirmasi pengajuan baru.",
            icon: ClipboardCheck,
            href: "/loan/new?tab=admin",
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
        },
        {
            title: "Riwayat Peminjaman",
            description: "Arsip semua peminjaman (Selesai/Ditolak).",
            icon: History,
            href: "/admin/history",
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
    ]

    const menuItems = user?.role === "admin" ? adminMenu : mahasiswaMenu

    return (
        <div className="space-y-8 max-w-6xl mx-auto pt-10 relative">
            <div className="absolute top-0 right-0">
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </Button>
            </div>

            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                    Hi, {user?.username}
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Selamat datang di Sistem Peminjaman Ruangan & Alat Universitas. Silakan pilih menu di bawah ini.
                </p>
            </div>

            <div className={`grid gap-6 mx-auto ${user?.role === 'admin' ? 'md:grid-cols-3 max-w-5xl' : 'md:grid-cols-2 max-w-3xl'}`}>
                {menuItems.map((item) => (
                    <Link key={item.href} href={item.href} className="block group h-full">
                        <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 cursor-pointer">
                            <CardHeader className="text-center pb-2">
                                <div className={`w-16 h-16 rounded-2xl ${item.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className={`h-8 w-8 ${item.color}`} />
                                </div>
                                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground mb-6">
                                    {item.description}
                                </p>
                                <div className="inline-flex items-center text-sm font-medium text-primary bg-primary/5 px-4 py-2 rounded-full group-hover:bg-primary/10 transition-colors">
                                    Buka Menu <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
