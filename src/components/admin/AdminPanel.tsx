"use client"

import { useState } from "react"
import { useBooking } from "@/context/BookingContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function AdminPanel() {
    const { bookings, updateBookingStatus } = useBooking()
    const [rejectId, setRejectId] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")

    const pendingBookings = bookings.filter(b => b.status === "Menunggu")

    const safeRenderAlat = (alat: any) => {
        if (!alat) return '-'

        if (Array.isArray(alat)) return alat.join(', ')

        if (typeof alat === 'string') {
            if (alat.startsWith('[')) {
                try {
                    const parsed = JSON.parse(alat)
                    return Array.isArray(parsed) ? parsed.join(', ') : parsed
                } catch {
                    return alat 
                }
            }
            return alat
        }

        return '-'
    }

    const handleRejectClick = (id: string) => {
        setRejectId(id)
        setRejectReason("")
    }

    const confirmReject = () => {
        if (rejectId && rejectReason.trim()) {
            updateBookingStatus(rejectId, "Ditolak", rejectReason)
            setRejectId(null)
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Daftar Persetujuan Peminjaman</h2>

            {pendingBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                    Tidak ada permintaan peminjaman yang menunggu persetujuan.
                </div>
            ) : (
                <div className="grid gap-4">
                    {pendingBookings.map(booking => (
                        <Card key={booking.id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-base">{booking.room}</CardTitle>
                                        <CardDescription>
                                            {booking.date} | {booking.time}
                                        </CardDescription>
                                    </div>
                                    <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                        {booking.status}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium">Peminjam:</span> {booking.user}
                                    </div>

                                    {booking.tipePeminjam === "ukm" && (
                                        <div>
                                            <span className="font-medium">Asal UKM:</span> {booking.organisasi}
                                        </div>
                                    )}
                                    {booking.tipePeminjam === "ormawa" && (
                                        <div>
                                            <span className="font-medium">Asal Himpunan:</span> {booking.organisasi}
                                        </div>
                                    )}

                                    <div>
                                        <span className="font-medium">Keperluan:</span> {booking.details.keperluan}
                                    </div>

                                    {/* DISINI PENGAMANNYA DIPANGGIL */}
                                    <div>
                                        <span className="font-medium">Alat:</span> {safeRenderAlat(booking.details.alat)}
                                    </div>

                                    {booking.details.kakFile && (
                                        <div>
                                            <span className="font-medium">File KAK:</span> {booking.details.kakFile}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleRejectClick(booking.id)}
                                    >
                                        <X className="w-4 h-4 mr-1" /> Tolak
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => updateBookingStatus(booking.id, "Disetujui")}
                                    >
                                        <Check className="w-4 h-4 mr-1" /> Setujui
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={!!rejectId} onOpenChange={(open) => !open && setRejectId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Masukkan Alasan Penolakan</DialogTitle>
                        <DialogDescription>
                            Jelaskan mengapa permohonan ini ditolak agar peminjam dapat memahaminya.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Alasan</Label>
                            <Textarea
                                id="reason"
                                placeholder="Contoh: Ruangan sedang direnovasi, Jadwal bentrok..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectId(null)}>Batal</Button>
                        <Button
                            variant="destructive"
                            onClick={confirmReject}
                            disabled={!rejectReason.trim()}
                        >
                            Kirim Penolakan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}