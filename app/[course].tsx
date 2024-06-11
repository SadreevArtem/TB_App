import { api } from '@/Api/Api';
import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useJwtToken } from '@/hooks/useJwtToken';
import { useAuthStore } from '@/stores/auth-store';
import { ILesson, ILessonProgress, IProgress } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Stack, router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { ActivityIndicator, Button, IconButton, MD2Colors, MD3Colors } from 'react-native-paper';

export default function Course() {
  const { course } = useLocalSearchParams();
  const token = useAuthStore((state) => state.token);
  const { sub } = useJwtToken();
  
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const getCourseFunc = () => api.getCourseById(token, Number(course)).then((res) => res.json());
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["course-id"],
    queryFn: getCourseFunc,
    gcTime: 0
  });
  const getUserLessonStatusFunc = () => api.getUserLessonsStatus(token, Number(course)).then((res) => res.json());
  const addCourseFunc = () => api.startCourse(Number(course), sub || 0);
  const startLessonFunc = (lessonId: number) => api.startLesson(lessonId, sub || 0, Number(course));
  const completeLessonFunc = (lessonId: number) => api.completeLesson(sub || 0, lessonId);
  const getUserProgressFunc = () => api.getUserCourseProgress(token).then((res) => res.json());
const progressQueryKey = ['about-progress']
  const { data: userLessonData } = useQuery({ queryKey: ['lessons-user'], queryFn: getUserLessonStatusFunc });
  const { data: userProgress, refetch: refetchProgress } = useQuery({ queryKey: progressQueryKey, queryFn: getUserProgressFunc, gcTime:0 });

  const mutation = useMutation({
    mutationFn: addCourseFunc,
    onError: () => {
      console.log("error add course"); 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-progress'] });
    },
  });

  const mutationStartLesson = useMutation({
    mutationFn: startLessonFunc,
    onError: () => {
      console.log("error start lesson"); 
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['lessons-user'] });
    },
  });

  const mutationCompleteLesson = useMutation({
    mutationFn: completeLessonFunc,
    onError: () => {
      console.log("error complete lesson"); 
    },
    onSuccess: () => {
      refetchProgress();
      queryClient.invalidateQueries({ queryKey: ['lessons-user'] });
    },
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  const currentCourseStatus: IProgress =
    Array.isArray(userProgress) &&
    userProgress?.find((el) => el.course.id === Number(course));

  return (
    <>
      <Stack.Screen options={{ title: "Курс" }} />
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <Image source={{ uri: data?.image }} style={styles.reactLogo} />
        }
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
          <ThemedText type="defaultSemiBold">Курс</ThemedText>
        </ThemedView>
        {isLoading ? (
          <ActivityIndicator animating={true} color={MD2Colors.red800} />
        ) : (
          <ThemedView>
            <ThemedText type="defaultSemiBold">{data.name}</ThemedText>
            <ThemedText style={{ marginTop: 8 }}>{data.description}</ThemedText>
          </ThemedView>
        )}
        {Array.isArray(userProgress)&& userProgress?.some((el: IProgress) => el.course.id === Number(course)) ? (
          <ThemedView>
            <ThemedView>
              {data?.lessons?.length ? data.lessons.sort((a:ILesson, b:ILesson)=> a.orderNumber - b.orderNumber).map((elem: ILesson) => {
                const currentLessonStatus: ILessonProgress = userLessonData?.find((element: ILessonProgress) => element.lesson.id === elem.id);

                if (!currentLessonStatus) {
                  return (
                    <Collapsible key={elem.id} title={elem.title}>
                      <ThemedView style={{ marginTop: 8 }}>
                        <Button style={{ height: 40 }} mode="outlined" onPress={() => mutationStartLesson.mutate(elem.id)}>
                          Начать прохождение
                        </Button>
                      </ThemedView>
                    </Collapsible>
                  );
                }

                if (currentLessonStatus.status !== 'completed') {
                  return (
                    <Collapsible key={elem.id} title={elem.title}>
                      <ThemedText>{elem.content}</ThemedText>
                      <ThemedView style={{ marginTop: 8 }}>
                        <Button style={{ height: 40, marginBottom:10 }} mode="outlined" onPress={() => mutationCompleteLesson.mutate(elem.id)}>
                          Отметить как выполненный
                        </Button>
                      </ThemedView>
                    </Collapsible>
                  );
                }

                return <ThemedText key={elem.id}>Урок пройден</ThemedText>;
              }) : null}
            </ThemedView>
          </ThemedView>
        ) : (
          <Button
            mode="outlined"
            onPress={() => {
              mutation.mutate();
              refetch();
            }}
          >
            Записаться на курс
          </Button>
        )}
        {currentCourseStatus?.status==="completed" && <ThemedText type="defaultSemiBold">Курс успешно завершен</ThemedText>}
      </ParallaxScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center'
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
    top: 0,
    position: "absolute",
  },
});
