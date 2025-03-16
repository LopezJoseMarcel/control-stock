import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col items-center  gap-8">
        <Image src="/lobo.svg" alt="lobo logo" width={300} height={300} priority />
        <h1 className="text-2xl font-semibold text-center sm:text-left">
          Control de Stock Consultorio Dr. Cubano
        </h1>
      </main>

      <footer className="w-full text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Todos los derechos reservados.
      </footer>
    </div>
  );
}
