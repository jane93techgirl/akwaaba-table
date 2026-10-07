import { useEffect, useState } from "react"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShoppingBag,
  X,
  Plus,
  Minus,
  CalendarDays,
  ChevronRight,
  Star,
} from "lucide-react"

import grilledTilapia from "./assets/grilled-tilapia.jpg"
import smokedTilapia from "./assets/smoked-tilapia.jpg"
import jollof from "./assets/jollof.jpg"
import jollofChicken from "./assets/jollof-chicken.jpg"
import kelewele from "./assets/kelewele.jpg"

type MenuItem = {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
}

type CartItem = MenuItem & {
  quantity: number
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Kelewele",
    description: "Spiced fried plantain cubes with roasted peanuts.",
    price: 45,
    category: "Starters",
    image: kelewele,
  },
  {
    id: 2,
    name: "Smoky Jollof & Chicken",
    description: "Rich Ghanaian jollof served with tender grilled chicken.",
    price: 95,
    category: "Main Courses",
    image: jollofChicken,
  },
  {
    id: 3,
    name: "Grilled Tilapia",
    description:
      "Whole tilapia grilled to perfection with fresh herbs and Ghanaian spices.",
    price: 145,
    category: "Main Courses",
    image: grilledTilapia,
  },
  {
    id: 4,
    name: "Smoked Tilapia",
    description:
      "Tender smoked tilapia infused with rich, smoky Ghanaian flavours.",
    price: 155,
    category: "Main Courses",
    image: smokedTilapia,
  },
  {
    id: 5,
    name: "Creamy Garlic Pasta",
    description: "Creamy pasta tossed with garlic, herbs and parmesan.",
    price: 85,
    category: "Main Courses",
    image:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Jollof & Fried Plantain",
    description: "Classic Ghanaian jollof paired with sweet crispy plantain.",
    price: 75,
    category: "Main Courses",
    image: jollof,
  },
  {
    id: 7,
    name: "Yam Fries",
    description: "Crispy golden yam fries served with our signature dip.",
    price: 40,
    category: "Sides",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a rich molten centre.",
    price: 55,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 9,
    name: "Sobolo Spritz",
    description: "Refreshing hibiscus drink with citrus and aromatic spices.",
    price: 35,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
  },
]

const categories = [
  "All",
  "Starters",
  "Main Courses",
  "Sides",
  "Desserts",
  "Drinks",
]

const testimonials = [
  {
    name: "Ama K.",
    text: "The food was absolutely amazing. The jollof was smoky, rich and perfectly seasoned.",
    rating: 5,
  },
  {
    name: "Michael T.",
    text: "Beautiful atmosphere, friendly service and the grilled tilapia was incredible.",
    rating: 5,
  },
  {
    name: "Nana A.",
    text: "Akwaaba Table is now one of my favourite places to eat. Everything felt intentional.",
    rating: 5,
  },
]

function App() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showReservation, setShowReservation] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reservationSuccess, setReservationSuccess] = useState(false)

  const [reservation, setReservation] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    message: "",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory)

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  const addToCart = (item: MenuItem) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.id === item.id,
      )

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        )
      }

      return [...currentCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const handleReservationSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    try {
      const response = await fetch(
        "http://localhost:5000/api/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: reservation.name,
            email: reservation.email,
            phone: reservation.phone,
            date: reservation.date,
            time: reservation.time,
            guests: Number(reservation.guests),
            message: reservation.message,
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Reservation failed")
      }

      setReservationSuccess(true)

      setReservation({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "2",
        message: "",
      })
    } catch (error) {
      console.error(error)
      alert(
        "We couldn't submit your reservation. Please make sure the backend server is running.",
      )
    }
  }

  const closeReservation = () => {
    setShowReservation(false)
    setReservationSuccess(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#17110d] text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#d6a15d]/40">
            <span className="text-2xl">A</span>
          </div>

          <p className="text-xs uppercase tracking-[0.4em] text-[#d6a15d]">
            Akwaaba Table
          </p>

          <p className="mt-3 text-sm text-white/50">
            A taste of Ghana, beautifully reimagined.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#241811]">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#17110d]/95 text-white backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6a15d]/60">
              <span className="font-serif text-lg text-[#d6a15d]">A</span>
            </div>

            <div>
              <p className="font-serif text-lg">Akwaaba Table</p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/50">
                Ghanaian Dining
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a href="#home" className="transition hover:text-[#d6a15d]">
              Home
            </a>
            <a href="#about" className="transition hover:text-[#d6a15d]">
              About
            </a>
            <a href="#menu" className="transition hover:text-[#d6a15d]">
              Menu
            </a>
            <a href="#gallery" className="transition hover:text-[#d6a15d]">
              Gallery
            </a>
            <a href="#contact" className="transition hover:text-[#d6a15d]">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCart(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/10"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-4 w-4" />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d6a15d] text-[10px] font-bold text-[#17110d]">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowReservation(true)}
              className="hidden rounded-full bg-[#d6a15d] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#17110d] transition hover:bg-[#e4b777] sm:block"
            >
              Reserve a Table
            </button>
          </div>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="relative flex min-h-screen items-center overflow-hidden bg-[#17110d] text-white"
        >
          <div className="absolute inset-0">
            <img
              src={grilledTilapia}
              alt="Grilled tilapia"
              className="h-full w-full object-cover opacity-40"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#17110d] via-[#17110d]/80 to-[#17110d]/30" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-5 pt-28 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[#d6a15d]">
                Welcome to Akwaaba Table
              </p>

              <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-8xl">
                A taste of Ghana,
                <span className="block italic text-[#d6a15d]">
                  beautifully reimagined.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/70">
                Experience authentic Ghanaian flavours, thoughtfully prepared
                with fresh ingredients and served in a warm, contemporary
                setting.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="#menu"
                  className="rounded-full bg-[#d6a15d] px-7 py-3.5 text-sm font-semibold text-[#17110d] transition hover:bg-[#e4b777]"
                >
                  Explore Our Menu
                </a>

                <button
                  onClick={() => setShowReservation(true)}
                  className="rounded-full border border-white/20 px-7 py-3.5 text-sm transition hover:bg-white/10"
                >
                  Reserve a Table
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="bg-[#faf7f2] px-5 py-24 lg:px-8 lg:py-32"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem]">
                <img
                  src={smokedTilapia}
                  alt="Smoked tilapia"
                  className="h-[520px] w-full object-cover"
                />
              </div>

              <div className="absolute -bottom-8 -right-5 hidden rounded-2xl bg-[#17110d] px-8 py-6 text-white shadow-xl sm:block">
                <p className="font-serif text-3xl text-[#d6a15d]">10+</p>

                <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                  Years of flavour
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#b47b35]">
                Our Story
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Where tradition meets
                <span className="block italic text-[#b47b35]">
                  modern Ghana.
                </span>
              </h2>

              <p className="mt-7 leading-8 text-[#6c5b50]">
                Akwaaba Table is a celebration of Ghanaian food, culture and
                hospitality. We take the flavours we grew up with and present
                them with a modern touch while keeping the heart of the
                cuisine intact.
              </p>

              <p className="mt-5 leading-8 text-[#6c5b50]">
                From smoky jollof to perfectly grilled tilapia, every plate is
                prepared with care, passion and a deep appreciation for the
                richness of Ghanaian cuisine.
              </p>

              <a
                href="#menu"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#8f612b]"
              >
                Discover our menu
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section
          id="menu"
          className="bg-[#17110d] px-5 py-24 text-white lg:px-8 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#d6a15d]">
                  From our kitchen
                </p>

                <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                  Our Menu
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-white/55">
                  Familiar Ghanaian favourites and contemporary dishes made
                  with fresh ingredients.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-2 text-xs transition ${
                      activeCategory === category
                        ? "bg-[#d6a15d] text-[#17110d]"
                        : "border border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-xl">{item.name}</h3>

                        <p className="mt-2 text-sm leading-6 text-white/45">
                          {item.description}
                        </p>
                      </div>

                      <p className="whitespace-nowrap text-sm font-semibold text-[#d6a15d]">
                        GH₵{item.price}
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-[#d6a15d]/40 py-2.5 text-xs font-semibold text-[#d6a15d] transition hover:bg-[#d6a15d] hover:text-[#17110d]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add to Order
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#efe5d8] px-5 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#8f612b]">
                Chef's Signature
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                The perfect
                <span className="block italic text-[#8f612b]">
                  Ghanaian catch.
                </span>
              </h2>

              <p className="mt-6 max-w-lg leading-8 text-[#6c5b50]">
                Our grilled tilapia is seasoned with a blend of aromatic
                Ghanaian spices and grilled until beautifully tender. Served
                with fresh sides, it's a true taste of the coast.
              </p>

              <div className="mt-7 flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-[#b47b35] text-[#b47b35]"
                    />
                  ))}
                </div>

                <span className="text-sm text-[#6c5b50]">
                  Guest favourite
                </span>
              </div>

              <button
                onClick={() => addToCart(menuItems[2])}
                className="mt-8 rounded-full bg-[#17110d] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#30231c]"
              >
                Order Grilled Tilapia
              </button>
            </div>

            <div className="overflow-hidden rounded-[2rem]">
              <img
                src={grilledTilapia}
                alt="Grilled tilapia"
                className="h-[500px] w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section
          id="gallery"
          className="bg-[#faf7f2] px-5 py-24 lg:px-8 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[#b47b35]">
                A glimpse inside
              </p>

              <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                The Akwaaba Experience
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={grilledTilapia}
                  alt="Grilled tilapia"
                  className="h-72 w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="overflow-hidden rounded-2xl">
                <img
                  src={smokedTilapia}
                  alt="Smoked tilapia"
                  className="h-72 w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="overflow-hidden rounded-2xl">
                <img
                  src={menuItems[1].image}
                  alt="Smoky jollof"
                  className="h-72 w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="overflow-hidden rounded-2xl">
                <img
                  src={menuItems[6].image}
                  alt="Yam fries"
                  className="h-72 w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#17110d] px-5 py-24 text-white lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[#d6a15d]">
                Guest stories
              </p>

              <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                What our guests say
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
                >
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map(
                      (_, index) => (
                        <Star
                          key={index}
                          className="h-4 w-4 fill-[#d6a15d] text-[#d6a15d]"
                        />
                      ),
                    )}
                  </div>

                  <p className="mt-5 leading-7 text-white/65">
                    “{testimonial.text}”
                  </p>

                  <p className="mt-6 text-sm font-semibold text-[#d6a15d]">
                    {testimonial.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="bg-[#faf7f2] px-5 py-24 lg:px-8 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#b47b35]">
                  Come dine with us
                </p>

                <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
                  We'd love to
                  <span className="block italic text-[#b47b35]">
                    welcome you.
                  </span>
                </h2>

                <p className="mt-6 max-w-lg leading-8 text-[#6c5b50]">
                  Whether it's a casual lunch, a special celebration or dinner
                  with friends, there's always a seat waiting for you at
                  Akwaaba Table.
                </p>

                <button
                  onClick={() => setShowReservation(true)}
                  className="mt-8 rounded-full bg-[#17110d] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#30231c]"
                >
                  Reserve Your Table
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="overflow-hidden rounded-2xl bg-[#efe5d8]">
                  <div className="p-6">
                    <MapPin className="h-5 w-5 text-[#b47b35]" />

                    <h3 className="mt-4 font-serif text-xl">Location</h3>

                    <p className="mt-2 text-sm leading-6 text-[#6c5b50]">
                      Tseaddo, Accra, Ghana
                    </p>
                  </div>

                  <div className="h-64 w-full">
                    <iframe
                      src="https://www.google.com/maps?q=Tseaddo,+Accra,+Ghana&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Akwaaba Table Location"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-[#efe5d8] p-6">
                  <Phone className="h-5 w-5 text-[#b47b35]" />

                  <h3 className="mt-4 font-serif text-xl">Call Us</h3>

                  <p className="mt-2 text-sm leading-6 text-[#6c5b50]">
                    +233 00 000 0000
                  </p>
                </div>

                <div className="rounded-2xl bg-[#efe5d8] p-6">
                  <Mail className="h-5 w-5 text-[#b47b35]" />

                  <h3 className="mt-4 font-serif text-xl">Email</h3>

                  <p className="mt-2 text-sm leading-6 text-[#6c5b50]">
                    akwaabatable@gmail.com
                  </p>
                </div>

                <div className="rounded-2xl bg-[#efe5d8] p-6">
                  <Clock className="h-5 w-5 text-[#b47b35]" />

                  <h3 className="mt-4 font-serif text-xl">Opening Hours</h3>

                  <p className="mt-2 text-sm leading-6 text-[#6c5b50]">
                    Mon - Sun
                    <br />
                    9:00 AM - 11:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#17110d] px-5 py-12 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6a15d]/60">
                <span className="font-serif text-lg text-[#d6a15d]">A</span>
              </div>

              <div>
                <p className="font-serif text-lg">Akwaaba Table</p>

                <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">
                  Ghanaian Dining
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/40">
              A modern celebration of Ghanaian food, culture and hospitality.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Akwaaba Table Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/10"
            />

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Akwaaba Table Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/10"
            />
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/30">
          © {new Date().getFullYear()} Akwaaba Table. All rights reserved.
        </div>
      </footer>

      {showCart && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm">
          <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#faf7f2] text-[#241811] shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#8f612b]">
                  Your order
                </p>

                <h2 className="font-serif text-2xl">Shopping Bag</h2>
              </div>

              <button
                onClick={() => setShowCart(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cart.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <ShoppingBag className="mx-auto h-10 w-10 text-black/20" />

                    <p className="mt-4 font-serif text-xl">
                      Your bag is empty
                    </p>

                    <p className="mt-2 text-sm text-black/50">
                      Add something delicious from our menu.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-black/10 pb-5"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-xl object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between gap-3">
                          <h3 className="font-serif">{item.name}</h3>

                          <p className="text-sm font-semibold">
                            GH₵{item.price * item.quantity}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center gap-3">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <span className="text-sm">{item.quantity}</span>

                          <button
                            onClick={() => addToCart(item)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-black/10 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black/50">Total</span>

                  <span className="font-serif text-2xl">
                    GH₵{cartTotal}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowCart(false)
                    setShowReservation(true)
                  }}
                  className="mt-5 w-full rounded-full bg-[#17110d] py-3.5 text-sm font-semibold text-white"
                >
                  Continue to Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showReservation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#faf7f2] text-[#241811] shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 sm:px-8">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#8f612b]">
                  Akwaaba
                </p>

                <h2 className="font-serif text-2xl">Reserve a Table</h2>
              </div>

              <button
                onClick={closeReservation}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {reservationSuccess ? (
              <div className="px-6 py-16 text-center sm:px-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#efe5d8]">
                  <CalendarDays className="h-7 w-7 text-[#b47b35]" />
                </div>

                <h3 className="mt-6 font-serif text-3xl">
                  Reservation Received
                </h3>

                <p className="mx-auto mt-4 max-w-md leading-7 text-black/50">
                  Thank you for choosing Akwaaba Table. We've received your
                  reservation request and will be in touch shortly.
                </p>

                <button
                  onClick={closeReservation}
                  className="mt-7 rounded-full bg-[#17110d] px-7 py-3 text-sm font-semibold text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleReservationSubmit}
                className="space-y-5 px-6 py-7 sm:px-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Full Name
                    </label>

                    <input
                      required
                      type="text"
                      value={reservation.name}
                      onChange={(event) =>
                        setReservation({
                          ...reservation,
                          name: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#b47b35]"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Email
                    </label>

                    <input
                      required
                      type="email"
                      value={reservation.email}
                      onChange={(event) =>
                        setReservation({
                          ...reservation,
                          email: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#b47b35]"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Phone
                    </label>

                    <input
                      required
                      type="tel"
                      value={reservation.phone}
                      onChange={(event) =>
                        setReservation({
                          ...reservation,
                          phone: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#b47b35]"
                      placeholder="+233..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Guests
                    </label>

                    <select
                      value={reservation.guests}
                      onChange={(event) =>
                        setReservation({
                          ...reservation,
                          guests: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#b47b35]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                        <option key={number} value={number}>
                          {number} {number === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Date
                    </label>

                    <input
                      required
                      type="date"
                      value={reservation.date}
                      onChange={(event) =>
                        setReservation({
                          ...reservation,
                          date: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#b47b35]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                      Time
                    </label>

                    <input
                      required
                      type="time"
                      value={reservation.time}
                      onChange={(event) =>
                        setReservation({
                          ...reservation,
                          time: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#b47b35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
                    Special Request
                  </label>

                  <textarea
                    rows={4}
                    value={reservation.message}
                    onChange={(event) =>
                      setReservation({
                        ...reservation,
                        message: event.target.value,
                      })
                    }
                    className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#b47b35]"
                    placeholder="Any special requests?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#17110d] py-4 text-sm font-semibold text-white transition hover:bg-[#30231c]"
                >
                  Confirm Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App