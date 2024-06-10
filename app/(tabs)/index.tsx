import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuthStore } from '@/stores/auth-store';
import { Auth } from '@/components/Auth';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/Api/Api';
import { ActivityIndicator, Avatar, Button, MD2Colors } from 'react-native-paper';
import dayjs from 'dayjs';
import { useJwtToken } from '@/hooks/useJwtToken';
import { Link } from 'expo-router';
import { IProgress } from '@/types';
import { Dictionary } from '@/constants/Dict';

export default function HomeScreen() {
  const token = useAuthStore((state) => state.token);
  const {sub} = useJwtToken();
  const isAdmin = sub ? sub == 1 : false;
  const isAuth = !!token; 
  const getUserInfoFunc = () =>api.getUserInfo(token).then((res) => res.json());
  const {data, isLoading} = useQuery({ queryKey: ['about-user'], queryFn: getUserInfoFunc });
  const getUserProgressFunc = ()=>api.getUserCourseProgress(token).then((res) => res.json());
  const {data: userProgress } = useQuery({ queryKey: ['about-progress'], queryFn: getUserProgressFunc, enabled: !isAdmin, gcTime:0 });

  return isAuth ? (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/crane.png")}
          style={styles.reactLogo}
        />
      }
    >
      {isLoading && (
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      )}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Личный кабинет</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">{`Пользователь - ${data?.username}`}</ThemedText>
        <Avatar.Image size={96} source={{ uri: data?.avatar }} />
        <ThemedText>
          <ThemedText type="defaultSemiBold">О себе:</ThemedText>{" "}
          {`${data?.about}`}
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">E-mail:</ThemedText>{" "}
          {`${data?.email}`}
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">На платформе:</ThemedText>{" "}
          {`с ${dayjs(data?.createdAt).locale("ru").format("DD.MM.YYYY")}`}
        </ThemedText>
      </ThemedView>
      {isAdmin && (
        <ThemedView style={styles.stepContainer}>
          <Link href="/users" asChild>
            <Button mode="outlined">Управление пользователями</Button>
          </Link>
        </ThemedView>
      )}
      {Boolean(userProgress?.length)&& !isAdmin && (
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Мои курсы</ThemedText>
          {userProgress.map((elem: IProgress) => (
            <ThemedView key={elem.id}>
              <ThemedText type="defaultSemiBold">{elem.course.name}</ThemedText>
              <ThemedText>{`статус: ${Dictionary[elem.status]}`}</ThemedText>
              {elem.status !== "completed" && (
                <Link
                  style={{ marginTop: 8 }}
                  href={`/${elem.course.id}`}
                  asChild
                >
                  <Button style={{ height: 40 }} mode="outlined">
                    Перейти к курсу
                  </Button>
                </Link>
              )}
            </ThemedView>
          ))}
        </ThemedView>
      )}
    </ParallaxScrollView>
  ) : (
    <Auth />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    top:0,
    position: "absolute",
  },
});
