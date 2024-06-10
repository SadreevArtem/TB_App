import { api } from "@/Api/Api";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuthStore } from "@/stores/auth-store";
import { IUser } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Stack, useNavigation } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator, Avatar, Button, Icon, IconButton, MD2Colors, MD3Colors } from "react-native-paper";

export default function Users(){
    const token = useAuthStore((state) => state.token);
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    useEffect(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation]);
    const getAllUsersFunc = ()=>api.getAllUsers(token).then((res) => res.json());
    const deleteUserFunc = (id:number)=> api.removeUser(token, id);
  const { data, isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUsersFunc,
  });
  const mutation = useMutation({
    mutationFn: deleteUserFunc,
    onError: ()=>{
      console.log("error delete"); 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
    },
  })

  
    return (
      <>
        <Stack.Screen options={{ title: "Пользователи" }} />
        <ParallaxScrollView
          headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
          headerImage={<Ionicons size={310} name="people-outline" />}
        >
          <ThemedView style={styles.container}>
            <Link href="/" asChild>
              <IconButton
                icon="chevron-left"
                mode="outlined"
                iconColor={MD3Colors.primary50}
                size={20}
              />
            </Link>
            <ThemedText type="defaultSemiBold">Пользователи</ThemedText>
          </ThemedView>
          {isLoading ? (
            <ActivityIndicator animating={true} color={MD2Colors.red800} />
          ) : (
            <ThemedView style={styles.users}>
              {Boolean(data?.length) &&
                data.map((elem: IUser, index: number) => (
                  <ThemedView style={styles.userRow} key={index}>
                    <Avatar.Image size={48} source={{ uri: elem?.avatar }} />
                    <ThemedText>{elem.email}</ThemedText>
                    <ThemedText>{elem.username}</ThemedText>
                    <Button
                      style={{ marginLeft: "auto" }}
                      onPress={() => {
                        mutation.mutate(elem.id);
                      }}
                    >
                      <Icon
                        source="delete"
                        color={MD3Colors.error50}
                        size={20}
                      />
                    </Button>
                  </ThemedView>
                ))}
            </ThemedView>
          )}
        </ParallaxScrollView>
      </>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center'
    },
    users: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
    },
    userRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap:8
    }
})