import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Form, type InputRef } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { authService } from "../../shared/services/auth.service";
import type { AxiosError } from "axios";
import { Link, useNavigate } from "react-router";
import { NAVIGATE_ROUTES } from "../../shared/constants/routing/routes.constants";
import { useAuthStore } from "../../shared/store/auth.store";
import { useMutation } from "@tanstack/react-query";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long"),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const emailInputRef = useRef<InputRef>(null);

  const { login } = useAuthStore();

  const navigation = useNavigate();

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const mutation = useMutation({
    mutationFn: (data: FormData) => authService.login(data),
    onSuccess: (data) => {
      login(data.access_token);
      navigation(NAVIGATE_ROUTES.home());
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        setError("email", { message: "Incorrect email or password" });
        setError("password", { message: "" });
      } else {
        setError("email", {
          message: "Something went wrong. Please try again.",
        });
      }
    },
  });

  const onSubmit = async (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Form
      onFinish={handleSubmit(onSubmit)}
      layout="vertical"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px]"
    >
      <Form.Item
        label="Email"
        validateStatus={errors.email ? "error" : ""}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              ref={emailInputRef}
              type="email"
              placeholder="Enter email"
              autoComplete="email"
              onChange={(e) => {
                clearErrors("email");
                field.onChange(e);
              }}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Password"
        validateStatus={errors.password ? "error" : ""}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              autoComplete="current-password"
              onChange={(e) => {
                clearErrors("password");
                field.onChange(e);
              }}
              suffix={
                showPassword ? (
                  <EyeTwoTone
                    onClick={togglePasswordVisibility}
                    onMouseDown={(e) => e.preventDefault()}
                  />
                ) : (
                  <EyeInvisibleOutlined
                    onClick={togglePasswordVisibility}
                    onMouseDown={(e) => e.preventDefault()}
                  />
                )
              }
            />
          )}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          block
        >
          Log in
        </Button>
      </Form.Item>

      <div className="text-center mt-4">
        <span>Don't have an account? </span>
        <Link to={NAVIGATE_ROUTES.signup()}>Sign up</Link>
      </div>
    </Form>
  );
}
