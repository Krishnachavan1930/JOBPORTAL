import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { setLoading, setUser } from '@/redux/authSlice'
import { USER_API_END_POINT } from '@/utils/constant'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [errors, setErrors] = useState({});
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        setErrors({ ...errors, [e.target.name]: "" });
    }

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        if (!input.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(input.email)) {
            newErrors.email = "Email is invalid";
            isValid = false;
        }

        if (!input.password) {
            newErrors.password = "Password is required";
            isValid = false;
        }

        if (!input.role) {
            newErrors.role = "Role selection is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.response) {
                toast.error(error.response.data.message || "An error occurred during login");
            } else if (error.request) {
                toast.error("No response received from the server. Please try again.");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-full max-w-md border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Login</h1>
                    <div className='my-2'>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="example@email.com"
                            aria-invalid={errors.email ? "true" : "false"}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className='my-2'>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            aria-invalid={errors.password ? "true" : "false"}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div className='my-5'>
                        <Label>Role</Label>
                        <RadioGroup className="flex items-center gap-4 mt-2" value={input.role} onValueChange={(value) => changeEventHandler({ target: { name: 'role', value } })}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="student" id="student" />
                                <Label htmlFor="student">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="recruiter" id="recruiter" />
                                <Label htmlFor="recruiter">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                    </div>
                    <Button type="submit" className="w-full my-4" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>
                    <p className='text-sm text-center'>
                        Don't have an account? <Link to="/signup" className='text-blue-600 hover:underline'>Signup</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login