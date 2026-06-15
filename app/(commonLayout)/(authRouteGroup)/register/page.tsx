"use client";

import RegisterForm from "@/components/modules/Auth/RegisterForm";
import React, { Suspense } from "react";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Suspense fallback={<div className="text-muted-foreground text-sm">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
};

export default RegisterPage;
