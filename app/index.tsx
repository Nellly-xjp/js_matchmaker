import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from './ctx/auth';

export default function SplashScreen() {
  const { isLoggedIn } = useAuth();

  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, damping: 8, stiffness: 150 }),
        Animated.timing(heartOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 150, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(titleSlide, { toValue: 0, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(600),
    ]).start(() => {
      router.replace(isLoggedIn ? '/(tabs)/profiles' : '/sign-in');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.heart, { opacity: heartOpacity, transform: [{ scale: Animated.multiply(heartScale, pulseAnim) }] }]}>
        💝
      </Animated.Text>
      <Animated.Text style={[styles.title, { opacity: titleOpacity, transform: [{ translateY: titleSlide }] }]}>
        MatchMaker
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        Агентство знайомств{'\n'}з інтелектуальним підбором
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FF2D55', alignItems: 'center', justifyContent: 'center' },
  heart: { fontSize: 90, marginBottom: 20 },
  title: { fontSize: 46, fontWeight: '900', color: '#fff', letterSpacing: 2, marginBottom: 12 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 24 },
});