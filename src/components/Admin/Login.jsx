import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "@radix-ui/react-label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Input } from "../ui/input";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { toast } from "sonner";

const Login = ({ setAdmin }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            console.log(formData);

            let response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/admin/login`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );
            response = await response.json();
            if (!response.ok) {
                return toast.error(response.message);
            }
            console.log("res", response);
            setAdmin(response.data.user);
            navigate("/country");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    const isFormValid = formData.email.trim() && formData.password.trim();
    return (
        <div className="w-fill h-screen flex justify-center items-center">
            <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900">
                        Airgorithm Admin Panel
                    </CardTitle>
                    <p className="text-slate-600 text-sm">
                        Sign in to your Airgorithm admin account
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-slate-700 text-sm font-medium"
                            >
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    className="pl-10 bg-white border-slate-300 text-slate-900 focus:border-slate-500"
                                    placeholder="john.doe@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-slate-700 text-sm font-medium"
                            >
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    className="pl-10 pr-10 bg-white border-slate-300 text-slate-900 focus:border-slate-500"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-white py-2.5 cursor-pointer"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                        <div className="text-center text-sm">
                            <button
                                type="button"
                                onClick={() => {
                                    window.location.href = `${
                                        import.meta.env.VITE_USER_PANEL_URL
                                    }/auth`;
                                }}
                                className="text-slate-900 hover:text-slate-700 font-medium cursor-pointer"
                            >
                                Go to user panel
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
