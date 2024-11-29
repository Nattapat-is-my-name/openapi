import React, { useState } from "react";
import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { AuthApi } from "../api";

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const authApi = new AuthApi();
      const response = await authApi.authRegisterPost({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        alert("Registration successful!");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1.5rem",
        border: "1px solid black",
        borderRadius: "0.5rem",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <Text textAlign="center" fontSize="2xl">
        Register
      </Text>

      <VStack align="stretch">
        <div>
          <Input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && (
            <Text color="red" fontSize="sm">
              {errors.username}
            </Text>
          )}
        </div>

        <div>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <Text color="red" fontSize="sm">
              {errors.email}
            </Text>
          )}
        </div>

        <div>
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <Text color="red" fontSize="sm">
              {errors.password}
            </Text>
          )}
        </div>

        <div>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && (
            <Text color="red" fontSize="sm">
              {errors.confirmPassword}
            </Text>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          opacity={loading ? 0.6 : 1}
          cursor={loading ? "not-allowed" : "pointer"}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </VStack>
    </form>
  );
};

export default RegisterForm;
