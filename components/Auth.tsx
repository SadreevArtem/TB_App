import { Controller, useForm } from "react-hook-form";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Text, StyleSheet, View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/Api/Api";
import { useAuthStore } from "@/stores/auth-store";
import { Button, TextInput } from "react-native-paper";
import { useEffect } from "react";
import { useNavigation } from "expo-router";

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
      const  setToken = useAuthStore((state)=> state.setToken)
      const queryClient = useQueryClient()
      const signInFunc = (input: IAuth)=> api.signInRequest(input).then((res) => res.json()).then((res)=> {
        setToken(res.access_token);
        api.setToken(res.access_token);
      });
      const mutation = useMutation({
        mutationFn: signInFunc,
        onSuccess: ()=> queryClient.invalidateQueries({ queryKey: ['about-user'] }),
        onError: (error)=> console.log(error)
      })
      const onSubmit = async (data: IAuth) => {
        await mutation.mutate({ ...data });
      };

    return (
      <ThemedView style={styles.authWrapper}>
        <ThemedText type="title">Авторизация</ThemedText>
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
              mode='outlined'
              style={{height: 48}}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="username"
        />
        {errors.username && <Text style={styles.error}>Обязательное поле</Text>}

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
               mode='outlined'
               style={{height: 48, width: 300
               }}
              onChangeText={onChange}
              right={<TextInput.Icon icon="eye" />}
              value={value}
            />
          )}
          name="password"
        />
        {errors.password && <Text style={styles.error}>Обязательное поле</Text>}
        <Button mode="outlined" onPress={handleSubmit(onSubmit)}>
          Авторизация
        </Button>
        </View>
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
