import React, { useState } from "react";
import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { AuthApi, DtosLoginRequest } from "../api";

export const LoginForm = () => {
  const [formData, setFormData] = useState<DtosLoginRequest>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      username: "",
      password: "",
    };
    let isValid = true;

    if (!formData.username?.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
    // Clear error when user starts typing
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
      const response = await authApi.authLoginPost({
        username: formData.username,
        password: formData.password,
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        alert("Login successful!");
        // Clear form after successful login
        setFormData({
          username: "",
          password: "",
        });
        // You might want to redirect here or update app state
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials."
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
        Login
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

        <Button
          type="submit"
          disabled={loading}
          opacity={loading ? 0.6 : 1}
          cursor={loading ? "not-allowed" : "pointer"}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </VStack>
    </form>
  );
};

export default LoginForm;
