import { StyleSheet, Image } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { api } from '@/Api/Api';
import { useAuthStore } from '@/stores/auth-store';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Button, MD2Colors } from 'react-native-paper';
import { ICourse } from '@/types';
import { Link } from 'expo-router';


export default function TabTwoScreen() {
  const token = useAuthStore((state) => state.token);
  const getAllCoursesFunc = ()=>api.getAllCourses(token).then((res) => res.json());
  const { data, isLoading } = useQuery({
    queryKey: ["all-courses"],
    queryFn: getAllCoursesFunc,
  });
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={require("@/assets/images/factory.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Курсы по технике безопасности</ThemedText>
      </ThemedView>

      {isLoading ? (
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      ) : (
        Boolean(data?.length) &&
        data.map((elem: ICourse) => (
          <Collapsible key={elem.id} title={elem.name}>
            <ThemedText>{elem.description}</ThemedText>
            <Link style={{marginTop:8}} href={`/${elem.id}`} asChild>
              <Button style={{height:40}} mode='outlined'>Узнать больше</Button>
            </Link>
          </Collapsible>
        ))
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
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
