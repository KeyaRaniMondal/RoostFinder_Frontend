import { RegisterForm } from "@/app/(auth)/_components/registerForm";

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900">Create your account</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Enter your details below to get started.
                </p>
                <div className="mt-6">
                    <RegisterForm />
                </div>
            </div>
        </main>
    );
}