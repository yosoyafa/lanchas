import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export function Dashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'confirmed', 'rejected', or 'calendar'

  // Fetch pending bookings
  const { data: pendingBookings = [], isLoading: loadingPending } = useQuery({
    queryKey: ['bookings', 'pending'],
    queryFn: async () => {
      const { data } = await api.get('/bookings?status=PAYMENT_SUBMITTED');
      return data;
    },
    refetchInterval: 30000,
    onError: (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  });

  // Fetch confirmed bookings
  const { data: confirmedBookings = [], isLoading: loadingConfirmed } = useQuery({
    queryKey: ['bookings', 'confirmed'],
    queryFn: async () => {
      const { data } = await api.get('/bookings?status=CONFIRMED');
      return data;
    },
    refetchInterval: 30000,
    onError: (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  });

  // Fetch rejected bookings
  const { data: rejectedBookings = [], isLoading: loadingRejected } = useQuery({
    queryKey: ['bookings', 'rejected'],
    queryFn: async () => {
      const { data } = await api.get('/bookings?status=REJECTED');
      return data;
    },
    refetchInterval: 30000,
    onError: (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  });

  // Fetch all bookings for calendar view
  const { data: allBookings = [], isLoading: loadingAll } = useQuery({
    queryKey: ['bookings', 'all'],
    queryFn: async () => {
      const { data } = await api.get('/bookings');
      return data;
    },
    refetchInterval: 30000,
    enabled: activeTab === 'calendar',
    onError: (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, date, boat, name }) =>
      api.post(`/bookings/${id}/approve`, {
        requestedDate: date,
        boatNumber: boat,
        customerName: name
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      alert('Reserva aprobada ✅');
    },
    onError: () => {
      alert('Error al aprobar la reserva');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) =>
      api.post(`/bookings/${id}/reject`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
      alert('Reserva rechazada ❌');
    },
    onError: () => {
      alert('Error al rechazar la reserva');
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const currentBookings = activeTab === 'pending' ? pendingBookings :
                         activeTab === 'confirmed' ? confirmedBookings :
                         activeTab === 'rejected' ? rejectedBookings :
                         allBookings;
  const isLoading = activeTab === 'pending' ? loadingPending :
                   activeTab === 'confirmed' ? loadingConfirmed :
                   activeTab === 'rejected' ? loadingRejected :
                   loadingAll;

  if (isLoading && currentBookings.length === 0 && activeTab !== 'calendar') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Reservas
          </h1>
          <button
            onClick={handleLogout}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm sm:text-base w-full sm:w-auto"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors relative ${
              activeTab === 'pending'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pendientes
            {pendingBookings.length > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingBookings.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors relative ${
              activeTab === 'confirmed'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Confirmadas
            {confirmedBookings.length > 0 && (
              <span className="ml-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                {confirmedBookings.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors relative ${
              activeTab === 'rejected'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Rechazadas
            {rejectedBookings.length > 0 && (
              <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {rejectedBookings.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 font-medium text-sm sm:text-base transition-colors relative ${
              activeTab === 'calendar'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Calendario
          </button>
        </div>

        {/* Content */}
        {activeTab === 'calendar' ? (
          <CalendarView
            bookings={allBookings}
            isLoading={loadingAll}
          />
        ) : currentBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
            <div className="text-gray-500 text-base sm:text-lg">
              {activeTab === 'pending' && 'No hay reservas pendientes'}
              {activeTab === 'confirmed' && 'No hay reservas confirmadas'}
              {activeTab === 'rejected' && 'No hay reservas rechazadas'}
            </div>
            <div className="text-gray-400 text-sm mt-2">
              {activeTab === 'pending' && 'Las nuevas reservas aparecerán aquí automáticamente'}
              {activeTab === 'confirmed' && 'Las reservas aprobadas aparecerán aquí'}
              {activeTab === 'rejected' && 'Las reservas rechazadas aparecerán aquí'}
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {currentBookings.map(booking => (
              activeTab === 'pending' ? (
                <PendingBookingCard
                  key={booking.id}
                  booking={booking}
                  onApprove={approveMutation.mutate}
                  onReject={rejectMutation.mutate}
                  isProcessing={approveMutation.isPending || rejectMutation.isPending}
                />
              ) : activeTab === 'rejected' ? (
                <RejectedBookingCard
                  key={booking.id}
                  booking={booking}
                />
              ) : (
                <ConfirmedBookingCard
                  key={booking.id}
                  booking={booking}
                />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Calendar View Component
function CalendarView({ bookings, isLoading }) {
  const [selectedDate, setSelectedDate] = useState(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-600">Cargando calendario...</div>
      </div>
    );
  }

  // Group bookings by date
  const bookingsByDate = {};
  bookings.forEach(booking => {
    if (booking.requestedDate && (booking.status === 'CONFIRMED' || booking.status === 'PAYMENT_SUBMITTED')) {
      const dateKey = new Date(booking.requestedDate).toDateString();
      if (!bookingsByDate[dateKey]) {
        bookingsByDate[dateKey] = [];
      }
      bookingsByDate[dateKey].push(booking);
    }
  });

  // Get bookings for selected date
  const selectedBookings = selectedDate
    ? bookingsByDate[selectedDate.toDateString()] || []
    : [];

  // Add custom class to dates with bookings
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = date.toDateString();
      const dayBookings = bookingsByDate[dateKey] || [];

      if (dayBookings.length === 0) return '';

      const hasConfirmed = dayBookings.some(b => b.status === 'CONFIRMED');
      const hasPending = dayBookings.some(b => b.status === 'PAYMENT_SUBMITTED');
      const hasLancha1 = dayBookings.some(b => b.boatNumber === 1);
      const hasLancha2 = dayBookings.some(b => b.boatNumber === 2);

      let classes = 'has-booking ';
      if (hasConfirmed && hasPending) classes += 'mixed-booking';
      else if (hasConfirmed) classes += 'confirmed-booking';
      else classes += 'pending-booking';

      if (hasLancha1 && hasLancha2) classes += ' both-boats';

      return classes;
    }
    return '';
  };

  // Add content to tiles
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateKey = date.toDateString();
      const dayBookings = bookingsByDate[dateKey] || [];

      if (dayBookings.length === 0) return null;

      const hasLancha1 = dayBookings.some(b => b.boatNumber === 1);
      const hasLancha2 = dayBookings.some(b => b.boatNumber === 2);

      return (
        <div className="flex gap-0.5 justify-center mt-0.5">
          {hasLancha1 && (
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
          )}
          {hasLancha2 && (
            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Calendar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Calendario de Reservas</h2>
          <div className="flex gap-4 mt-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Lancha 1</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              <span>Lancha 2</span>
            </div>
          </div>
        </div>

        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName}
          tileContent={tileContent}
          locale="es-ES"
          className="w-full border-0"
        />
      </div>

      {/* Selected Date Details */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedDate
            ? `Reservas - ${selectedDate.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
            : 'Selecciona una fecha'}
        </h2>

        {selectedDate ? (
          selectedBookings.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No hay reservas para esta fecha
            </div>
          ) : (
            <div className="space-y-3">
              {selectedBookings.map(booking => (
                <div
                  key={booking.id}
                  className={`border-l-4 rounded-lg p-3 ${
                    booking.status === 'CONFIRMED'
                      ? 'border-green-500 bg-green-50'
                      : 'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      booking.status === 'CONFIRMED'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {booking.status === 'CONFIRMED' ? 'CONFIRMADA' : 'PENDIENTE'}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      🚤 Lancha {booking.boatNumber}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-gray-800">
                    {booking.customerName || formatPhone(booking.customerPhone)}
                  </p>

                  {booking.customerName && (
                    <p className="text-xs text-gray-600">
                      {formatPhone(booking.customerPhone)}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    ID: {booking.id.slice(0, 8)}
                  </p>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-gray-500 text-center py-8">
            Haz clic en una fecha del calendario para ver sus reservas
          </div>
        )}
      </div>
    </div>
  );
}

function formatPhone(phone) {
  const cleanPhone = phone.replace('@c.us', '');
  if (cleanPhone.startsWith('57') && cleanPhone.length > 10) {
    return `+${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8)}`;
  }
  return cleanPhone;
}

// Tarjeta para reservas pendientes (con botones de aprobar/rechazar)
function PendingBookingCard({ booking, onApprove, onReject, isProcessing }) {
  // Pre-fill with booking data if available
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const [date, setDate] = useState(formatDateForInput(booking.requestedDate));
  const [boat, setBoat] = useState(booking.boatNumber || 1);
  const [name, setName] = useState(booking.customerName || '');

  const handleApprove = () => {
    if (!date) {
      alert('Selecciona una fecha');
      return;
    }
    onApprove({ id: booking.id, date, boat, name });
  };

  const handleReject = () => {
    const reason = prompt('Motivo del rechazo:');
    if (reason) {
      onReject({ id: booking.id, reason });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPhone = (phone) => {
    const cleanPhone = phone.replace('@c.us', '');
    if (cleanPhone.startsWith('57') && cleanPhone.length > 10) {
      return `+${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8)}`;
    }
    return cleanPhone;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-shrink-0 w-full md:w-auto">
          <img
            src={booking.paymentReceiptUrl}
            alt="Comprobante de pago"
            className="w-full md:w-48 h-48 md:h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-200"
            onClick={() => window.open(booking.paymentReceiptUrl, '_blank')}
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
            Toca para ampliar
          </p>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-3 sm:mb-4">
            <p className="text-base sm:text-lg font-semibold text-gray-800 break-words">
              {formatPhone(booking.customerPhone)}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Recibido: {formatDate(booking.paymentSubmittedAt)}
            </p>
            <p className="text-xs text-gray-400 mt-1 truncate">
              ID: {booking.id}
            </p>
          </div>

          <div className="space-y-3">
            {booking.requestedDate && booking.boatNumber && booking.customerName && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                <p className="text-xs text-green-800">
                  ✅ Datos pre-llenados del cliente. Puedes modificarlos si es necesario.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Nombre Cliente {booking.customerName ? '✓' : '(Opcional)'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  booking.customerName ? 'border-green-300 bg-green-50' : 'border-gray-300'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Fecha de Reserva * {booking.requestedDate ? '✓' : ''}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    booking.requestedDate ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Lancha * {booking.boatNumber ? '✓' : ''}
                </label>
                <select
                  value={boat}
                  onChange={(e) => setBoat(Number(e.target.value))}
                  className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    booking.boatNumber ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  }`}
                >
                  <option value={1}>Lancha 1 (8 personas)</option>
                  <option value={2}>Lancha 2 (6 personas)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              ✅ Aprobar Reserva
            </button>
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              ❌ Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tarjeta para reservas confirmadas (solo vista, sin botones)
function ConfirmedBookingCard({ booking }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPhone = (phone) => {
    const cleanPhone = phone.replace('@c.us', '');
    if (cleanPhone.startsWith('57') && cleanPhone.length > 10) {
      return `+${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8)}`;
    }
    return cleanPhone;
  };

  return (
    <div className="bg-white border-l-4 border-green-500 rounded-lg p-3 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-shrink-0 w-full md:w-auto">
          <img
            src={booking.paymentReceiptUrl}
            alt="Comprobante de pago"
            className="w-full md:w-48 h-48 md:h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-200"
            onClick={() => window.open(booking.paymentReceiptUrl, '_blank')}
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
            Toca para ampliar
          </p>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  CONFIRMADA
                </span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                {booking.customerName || formatPhone(booking.customerPhone)}
              </p>
              {booking.customerName && (
                <p className="text-xs sm:text-sm text-gray-500">
                  {formatPhone(booking.customerPhone)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <span className="text-gray-600">📅</span>
              <span className="font-medium text-gray-900">
                {formatDate(booking.requestedDate)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <span className="text-gray-600">🚤</span>
              <span className="font-medium text-gray-900">
                Lancha {booking.boatNumber}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <span>✅</span>
              <span>Aprobada: {formatDateTime(booking.reviewedAt)}</span>
            </div>
          </div>

          <div className="text-xs text-gray-400 pt-3 border-t border-gray-100">
            ID: {booking.id}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tarjeta para reservas rechazadas (solo vista, sin botones)
function RejectedBookingCard({ booking }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPhone = (phone) => {
    const cleanPhone = phone.replace('@c.us', '');
    if (cleanPhone.startsWith('57') && cleanPhone.length > 10) {
      return `+${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8)}`;
    }
    return cleanPhone;
  };

  return (
    <div className="bg-white border-l-4 border-red-500 rounded-lg p-3 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-shrink-0 w-full md:w-auto">
          <img
            src={booking.paymentReceiptUrl}
            alt="Comprobante de pago"
            className="w-full md:w-48 h-48 md:h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-200"
            onClick={() => window.open(booking.paymentReceiptUrl, '_blank')}
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
            Toca para ampliar
          </p>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  RECHAZADA
                </span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                {booking.customerName || formatPhone(booking.customerPhone)}
              </p>
              {booking.customerName && (
                <p className="text-xs sm:text-sm text-gray-500">
                  {formatPhone(booking.customerPhone)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {booking.requestedDate && (
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <span className="text-gray-600">📅</span>
                <span className="font-medium text-gray-900">
                  {formatDate(booking.requestedDate)}
                </span>
              </div>
            )}
            {booking.boatNumber && (
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <span className="text-gray-600">🚤</span>
                <span className="font-medium text-gray-900">
                  Lancha {booking.boatNumber}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <span>❌</span>
              <span>Rechazada: {formatDateTime(booking.reviewedAt)}</span>
            </div>
          </div>

          {booking.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-red-800 mb-1">Motivo del rechazo:</p>
              <p className="text-sm text-red-700">{booking.rejectionReason}</p>
            </div>
          )}

          <div className="text-xs text-gray-400 pt-3 border-t border-gray-100">
            ID: {booking.id}
          </div>
        </div>
      </div>
    </div>
  );
}
