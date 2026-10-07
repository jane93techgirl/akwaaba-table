import { useEffect, useState } from "react"
import {
  CalendarDays,
  Clock3,
  Users,
  RefreshCw,
  UtensilsCrossed,
} from "lucide-react"

type Reservation = {
  id: number
  reservation_date: string
  reservation_time: string
  guests: number
  requests: string | null
  created_at: string
  status: "pending" | "confirmed" | "cancelled"
}

function Admin() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchReservations = async () => {
    try {
      setError("")

      const response = await fetch(
        "http://localhost:5000/api/reservations",
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch reservations",
        )
      }

      setReservations(data.data || [])
    } catch (error) {
      console.error("Error fetching reservations:", error)
      setError("Unable to load reservations.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchReservations()
  }

  const updateReservationStatus = async (
    id: number,
    status: "confirmed" | "cancelled",
  ) => {
    try {
      setUpdatingId(id)
      setError("")

      const response = await fetch(
        `http://localhost:5000/api/reservations/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      )

      const text = await response.text()

      let data = null

      try {
        data = JSON.parse(text)
      } catch {
        data = null
      }

      if (!response.ok) {
        throw new Error(
          data?.message || `Server returned ${response.status}`,
        )
      }

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === id
            ? {
                ...reservation,
                status,
              }
            : reservation,
        ),
      )
    } catch (error) {
      console.error("Error updating reservation:", error)

      alert(
        error instanceof Error
          ? error.message
          : "Unable to update the reservation.",
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const handleConfirm = (id: number) => {
    updateReservationStatus(id, "confirmed")
  }

  const handleCancel = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?",
    )

    if (!confirmed) {
      return
    }

    updateReservationStatus(id, "cancelled")
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const date = new Date()

    date.setHours(Number(hours), Number(minutes))

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-logo">
            <UtensilsCrossed size={22} />
          </div>

          <div>
            <p className="admin-eyebrow">AKWAABA TABLE</p>
            <h1>Restaurant Dashboard</h1>
          </div>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={refreshing ? "spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <main className="admin-content">
        <div className="dashboard-heading">
          <div>
            <p className="section-label">RESERVATIONS</p>
            <h2>Upcoming Bookings</h2>
          </div>

          <div className="reservation-count">
            {reservations.length}{" "}
            {reservations.length === 1
              ? "reservation"
              : "reservations"}
          </div>
        </div>

        {loading && (
          <div className="admin-message">
            Loading reservations...
          </div>
        )}

        {error && (
          <div className="admin-message error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          reservations.length === 0 && (
            <div className="admin-message">
              No reservations yet.
            </div>
          )}

        {!loading &&
          !error &&
          reservations.length > 0 && (
            <div className="reservation-grid">
              {reservations.map((reservation) => {
                const isUpdating =
                  updatingId === reservation.id

                return (
                  <article
                    className="reservation-card"
                    key={reservation.id}
                  >
                    <div className="reservation-card-top">
                      <span
                        className={`status-badge ${reservation.status}`}
                      >
                        {reservation.status
                          .charAt(0)
                          .toUpperCase() +
                          reservation.status.slice(1)}
                      </span>

                      <span className="reservation-id">
                        #{reservation.id}
                      </span>
                    </div>

                    <div className="reservation-date">
                      <CalendarDays size={19} />

                      <div>
                        <span>Date</span>

                        <strong>
                          {formatDate(
                            reservation.reservation_date,
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="reservation-details">
                      <div className="detail-item">
                        <Clock3 size={17} />

                        <div>
                          <span>Time</span>

                          <strong>
                            {formatTime(
                              reservation.reservation_time,
                            )}
                          </strong>
                        </div>
                      </div>

                      <div className="detail-item">
                        <Users size={17} />

                        <div>
                          <span>Guests</span>

                          <strong>
                            {reservation.guests}{" "}
                            {reservation.guests === 1
                              ? "Guest"
                              : "Guests"}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="request-box">
                      <span>Special Request</span>

                      <p>
                        {reservation.requests ||
                          "No special requests"}
                      </p>
                    </div>

                    {reservation.status === "pending" && (
                      <div className="reservation-actions">
                        <button
                          type="button"
                          className="confirm-button"
                          onClick={() =>
                            handleConfirm(reservation.id)
                          }
                          disabled={isUpdating}
                        >
                          {isUpdating
                            ? "Updating..."
                            : "Confirm Reservation"}
                        </button>

                        <button
                          type="button"
                          className="cancel-button"
                          onClick={() =>
                            handleCancel(reservation.id)
                          }
                          disabled={isUpdating}
                        >
                          {isUpdating
                            ? "Updating..."
                            : "Cancel Reservation"}
                        </button>
                      </div>
                    )}

                    {reservation.status === "confirmed" && (
                      <div className="reservation-status-message confirmed-message">
                        Reservation confirmed successfully.
                      </div>
                    )}

                    {reservation.status === "cancelled" && (
                      <div className="reservation-status-message cancelled-message">
                        Reservation cancelled.
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
      </main>
    </div>
  )
}

export default Admin
