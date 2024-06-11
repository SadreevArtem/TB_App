import { Controller, useForm } from "react-hook-form";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Text, StyleSheet, View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/Api/Api";
import { useAuthStore } from "@/stores/auth-store";
import { Button, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";

interface IAuth {
    username: string
    password: string
}
interface ISignUp extends IAuth {
  email: string;
}


export function Auth (){
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({
      defaultValues: {
        username: "",
        password: "",
        email: "",
      },
    });
      const  setToken = useAuthStore((state)=> state.setToken)
      const queryClient = useQueryClient()
      const signInFunc = (input: IAuth)=> api.signInRequest(input).then((res) => res.json()).then((res)=> {
        setToken(res.access_token);
        api.setToken(res.access_token);
      });
      const signUpFunc = (input: ISignUp)=> api.signUpRequest(input).then((res) => res.json()).then((res)=> {
        setToken(res.access_token);
        api.setToken(res.access_token);
      });
      const mutationSignIn = useMutation({
        mutationFn: signInFunc,
        onSuccess: ()=> queryClient.invalidateQueries({ queryKey: ['about-user'] }),
        onError: (error)=> console.log(error)
      })
      const mutationSignUp = useMutation({
        mutationFn: signUpFunc,
        onSuccess: ()=> queryClient.invalidateQueries({ queryKey: ['about-user'] }),
        onError: (error)=> console.log(error)
      })
      const onSubmit = (data: ISignUp| IAuth) => {
        if(isSignIn){
          const input = {username: data.username, password:  data.password}
          mutationSignIn.mutate({ ...input });
          return;
        }
        mutationSignUp.mutate({...data as ISignUp})
      };

    return (
      <ThemedView style={styles.authWrapper}>
        <ThemedText type="title">
          {isSignIn ? "Авторизация" : "Регистрация"}
        </ThemedText>
        <View style={styles.formWrapper}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Имя пользователя"
                onBlur={onBlur}
                mode="outlined"
                style={{ height: 48 }}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="username"
          />
          {errors.username && (
            <Text style={styles.error}>Обязательное поле</Text>
          )}
          {!isSignIn && (
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="E-mail"
                  onBlur={onBlur}
                  mode="outlined"
                  style={{ height: 48, width: 300 }}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="email"
            />
          )}

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Пароль"
                onBlur={onBlur}
                secureTextEntry
                mode="outlined"
                style={{ height: 48, width: 300 }}
                onChangeText={onChange}
                right={<TextInput.Icon icon="eye" />}
                value={value}
              />
            )}
            name="password"
          />

          {errors.password && (
            <Text style={styles.error}>Обязательное поле</Text>
          )}
          <Button mode="outlined" onPress={handleSubmit(onSubmit)}>
            {isSignIn ? "Авторизация" : "Зарегистрироваться"}
          </Button>
        </View>
        {isSignIn ? (
          <ThemedText style={{ marginTop: 10 }}>
            Если у вас нет аккаунта {" "}
            <ThemedText type="link" onPress={() => setIsSignIn(false)}>
              зарегистрируйтесь
            </ThemedText>
          </ThemedText>
        ) : (
          <ThemedText style={{ marginTop: 10 }}>
            У вас уже есть аккаунт?{" "}
          <ThemedText type="link" onPress={() => setIsSignIn(true)}>
            войти
          </ThemedText>
          </ThemedText>
        )}
      </ThemedView>
    );
};

const styles = StyleSheet.create({
  authWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
  },
  formWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    margin: 8,
  },
});
