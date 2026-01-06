"use client"

import { useBooking } from "@/context/BookingContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function AdminHistoryPage() {
    const { bookings } = useBooking()

    // Filter for completed bookings (Approved or Rejected)
    const historyBookings = bookings
        .filter(b => b.status !== "Menunggu")
        .sort((a, b) => {
            // Sort by date/time descending (newest first)
            const dateA = new Date(`${a.date}T${a.time}`)
            const dateB = new Date(`${b.date}T${b.time}`)
            return dateB.getTime() - dateA.getTime()
        })

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Riwayat Peminjaman</h1>
            </div>

            {historyBookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                    Belum ada riwayat peminjaman yang selesai.
                </div>
            ) : (
                <div className="grid gap-4">
                    {historyBookings.map(booking => (
                        <Card key={booking.id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-base">{booking.room}</CardTitle>
                                        <div className="text-sm text-muted-foreground">
                                            {booking.date} | {booking.time}
                                        </div>
                                    </div>
                                    <Badge variant={booking.status === "Disetujui" ? "default" : "destructive"}>
                                        {booking.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                        <div><span className="font-medium">Peminjam:</span> {booking.user}</div>
                                        {booking.organisasi && (
                                            <div>
                                                <span className="font-medium">
                                                    {booking.tipePeminjam === "ukm" ? "Asal UKM:" : "Asal Himpunan:"}
                                                </span>{" "}
                                                <span className="text-blue-600 font-medium">{booking.organisasi}</span>
                                            </div>
                                        )}
                                        <div><span className="font-medium">Keperluan:</span> {booking.details.keperluan}</div>
                                    </div>

                                    {booking.status === "Ditolak" && booking.alasanPenolakan && (
                                        <div className="bg-red-50 p-3 rounded-md border border-red-100 text-red-800">
                                            <span className="font-medium block mb-1">Alasan Penolakan:</span>
                                            {booking.alasanPenolakan}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
