import type React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { GalleryVerticalEnd } from "lucide-react";
import authSdk from "@/services/sdk-simple-auth";
import { useState } from "react";
interface UserLogin {
  usuario: string;
  clave: string;
}
const LoginScreen = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {

  const [user, setUser] = useState<UserLogin>({
    usuario: "",
    clave: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await authSdk.login({
        usuario: user.usuario,
        clave: user.clave,
      }); 
    } catch (error:any) {
      console.error("Error al iniciar sesión, verifica tus credenciales:", error?.message);
    }
  };
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          TPS Intermotors
        </div>

        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="border border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-gray-600">
                Bienvenido de nuevo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="usuario">Usuario</Label>
                      <Input
                        value={user.usuario}
                        onChange={handleChange}
                        autoComplete="username"
                        name="usuario"
                        id="usuario"
                        type="text"
                        placeholder="Ingrese su usuario"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Contraseña</Label>
                        <a
                          href="#"
                          className="ml-auto text-xs underline-offset-4 hover:underline"
                        >
                          ¿Olvidaste tu contraseña?
                        </a>
                      </div>
                      <Input
                        name="clave"
                        value={user.clave}
                        onChange={handleChange}
                        autoComplete="current-password"
                        id="password"
                        type="password"
                        placeholder="Ingrese su contraseña"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Iniciar sesión
                    </Button>
                  </div>
                  {/* <div className="text-center text-sm">
                    ¿No tienes una cuenta?{" "}
                    <a href="#" className="underline underline-offset-4">
                      Regístrate
                    </a>
                  </div> */}
                </div>
              </form>
            </CardContent>
          </Card>
          {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            Al hacer clic en continuar, aceptas nuestros{" "}
            <a href="#">Términos de servicio</a> y{" "}
            <a href="#">Política de privacidad</a>.
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
