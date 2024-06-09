import { Controller, useForm } from "react-hook-form";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Button, Text, TextInput, StyleSheet } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/Api/Api";
import { useAuthStore } from "@/stores/auth-store";

interface IAuth {
    username: string
    password: string
}

export function Auth (){
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({
      defaultValues: {
        username: "",
        password: "",
      },
    });
      const setToken = useAuthStore((state) => state.setToken)
      const signInFunc = (input: IAuth)=> api.signInRequest(input).then((res) => res.json()).then((res)=> setToken(res.access_token));
      const mutation = useMutation({
        mutationFn: signInFunc,
        onError: (error)=> console.log(error)
        
      })
      const onSubmit = async (data: IAuth) => {
        await mutation.mutate({ ...data });
      };
    return (
      <ThemedView style={styles.authWrapper}>
        <ThemedText type="title">Авторизация</ThemedText>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Имя пользователя"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="username"
        />
        {errors.username && <Text>This is required.</Text>}

        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Пароль"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="password"
        />

        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </ThemedView>
    );
};

const styles = StyleSheet.create({
    authWrapper: {
        flex: 1,
    alignItems: "center",
    justifyContent: "center",
    }
});
