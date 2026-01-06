"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { BookingGrid } from "@/components/booking/BookingGrid"
import { AdminPanel } from "@/components/admin/AdminPanel"
import { Button } from "@/components/ui/button"
import { useBooking } from "@/context/BookingContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, LayoutDashboard } from "lucide-react"

function LoanPageContent() {
    const { user, logout } = useAuth()
    const { bookings, cancelBooking } = useBooking()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"grid" | "history" | "admin">("grid")

    useEffect(() => {
        const tab = searchParams.get("tab")
        if (tab === "history" && user?.role === "mahasiswa") {
            setActiveTab("history")
        } else if (tab === "admin" && user?.role === "admin") {
            setActiveTab("admin")
        } else {
            setActiveTab("grid")
        }
    }, [searchParams, user])

    if (!user) {
        return <div className="p-8 text-center">Silakan login terlebih dahulu.</div>
    }

    const myBookings = bookings.filter(b => b.user === user.username)

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            {/* Clean UI: No Header, just Tabs */}
            <div className="flex items-center justify-between border-b pb-2">
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="rounded-full gap-2 text-muted-foreground hover:text-primary"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Button>

                    <div className="w-px h-8 bg-border mx-2" />

                    <Button
                        variant={activeTab === "grid" ? "default" : "ghost"}
                        onClick={() => setActiveTab("grid")}
                        className="rounded-full"
                    >
                        Jadwal Ruangan
                    </Button>

                    {user.role === "mahasiswa" && (
                        <Button
                            variant={activeTab === "history" ? "default" : "ghost"}
                            onClick={() => setActiveTab("history")}
                            className="rounded-full"
                        >
                            Riwayat Saya
                        </Button>
                    )}

                    {user.role === "admin" && (
                        <Button
                            variant={activeTab === "admin" ? "default" : "ghost"}
                            onClick={() => setActiveTab("admin")}
                            className="rounded-full"
                        >
                            Daftar Persetujuan
                        </Button>
                    )}

                    {user.role === "admin" && (
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/admin/history")}
                            className="rounded-full"
                        >
                            Riwayat Peminjaman
                        </Button>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </Button>
            </div>

            {activeTab === "grid" && (
                <BookingGrid />
            )}

            {activeTab === "admin" && user.role === "admin" && (
                <AdminPanel />
            )}

            {activeTab === "history" && user.role === "mahasiswa" && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Riwayat Peminjaman Saya</h2>
                    {myBookings.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                            Belum ada riwayat peminjaman.
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {myBookings.map(booking => (
                                <Card key={booking.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-base">{booking.room}</CardTitle>
                                                <div className="text-sm text-muted-foreground">
                                                    {booking.date} | {booking.time}
                                                </div>
                                            </div>
                                            <div className={`text-xs px-2 py-1 rounded-full font-medium ${booking.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" :
                                                booking.status === "Disetujui" ? "bg-green-100 text-green-800" :
                                                    "bg-red-100 text-red-800"
                                                }`}>
                                                {booking.status}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="font-medium">Keperluan:</span> {booking.details.keperluan}</div>
                                            {booking.status === "Menunggu" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => cancelBooking(booking.id)}
                                                >
                                                    Batalkan
                                                </Button>
                                            )}
                                        </div>
                                        {booking.status === "Ditolak" && booking.alasanPenolakan && (
                                            <div className="mt-3 bg-red-50 p-3 rounded-md text-xs text-red-800 border border-red-100">
                                                <span className="font-bold block mb-1">Catatan Admin:</span>
                                                {booking.alasanPenolakan}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default function LoanPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoanPageContent />
        </Suspense>
    )
}
