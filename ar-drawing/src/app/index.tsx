import Slider from '@react-native-community/slider';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HEAD_DRAWING_STEPS, HeadSketch } from '@/components/head-sketch';

type ReferenceMode = 'tutorial' | 'custom' | 'sequence';
const MAX_SEQUENCE_STEPS = 20;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [referenceMode, setReferenceMode] = useState<ReferenceMode>('tutorial');
  const [customReferenceUri, setCustomReferenceUri] = useState<string | null>(null);
  const [sequenceUris, setSequenceUris] = useState<string[]>([]);
  const [isBuildingSequence, setIsBuildingSequence] = useState(false);
  const [opacity, setOpacity] = useState(0.65);
  const [currentStep, setCurrentStep] = useState(0);

  // Gesture değerleri UI thread üzerinde tutulur; bu sayede kamera önizlemesi akıcı kalır.
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const pinchStartScale = useSharedValue(1);
  const rotationStart = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    });
  const pinch = Gesture.Pinch()
    .onStart(() => {
      pinchStartScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = Math.max(0.35, Math.min(4, pinchStartScale.value * event.scale));
    });
  const rotate = Gesture.Rotation()
    .onStart(() => {
      rotationStart.value = rotation.value;
    })
    .onUpdate((event) => {
      rotation.value = rotationStart.value + event.rotation;
    });
  const composedGesture = Gesture.Simultaneous(pan, pinch, rotate);

  const referenceStyle = useAnimatedStyle(() => ({
    opacity,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  const pickReferenceImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('İzin gerekli', 'Referans görseli seçmek için galeri izni gerekir.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      setCustomReferenceUri(result.assets[0].uri);
      setReferenceMode('custom');
    }
  }, []);

  const addSequenceStep = useCallback(async () => {
    if (sequenceUris.length >= MAX_SEQUENCE_STEPS) {
      Alert.alert('Dizi sınırı', `Bir dizi en fazla ${MAX_SEQUENCE_STEPS} adım içerebilir.`);
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('İzin gerekli', 'Dizi görseli eklemek için galeri izni gerekir.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      setSequenceUris((steps) => [...steps, result.assets[0].uri]);
    }
  }, [sequenceUris.length]);

  const useSequence = () => {
    if (sequenceUris.length === 0) {
      Alert.alert('Dizi boş', 'Önce en az bir adım görseli eklemelisin.');
      return;
    }
    setReferenceMode('sequence');
    setCurrentStep(0);
    setIsBuildingSequence(false);
  };

  const returnToTutorial = () => {
    setReferenceMode('tutorial');
    setCurrentStep(0);
    setIsBuildingSequence(false);
  };

  if (!cameraPermission) {
    return <View style={styles.centered}><Text style={styles.message}>Kamera hazırlanıyor...</Text></View>;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>AR Çizim için kamera izni gerekli</Text>
        <Pressable style={styles.primaryButton} onPress={requestCameraPermission}>
          <Text style={styles.primaryButtonText}>Kameraya izin ver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {/* Kamera, tüm ekranı kaplayan temel katmandır; referans görsel bunun üstüne çizilir. */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.referenceImage, referenceStyle]}>
          {referenceMode === 'tutorial' ? (
            <HeadSketch step={currentStep} />
          ) : (
            <Animated.Image
              source={{
                uri:
                  referenceMode === 'sequence'
                    ? sequenceUris[currentStep]
                    : customReferenceUri ?? undefined,
              }}
              resizeMode="contain"
              style={StyleSheet.absoluteFill}
            />
          )}
        </Animated.View>
      </GestureDetector>

      <View style={[styles.panel, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        {isBuildingSequence ? (
          <View style={styles.sequenceBuilder}>
            <View style={styles.panelHeader}>
              <View>
                <Text style={styles.panelTitle}>Yeni eğitim dizisi</Text>
                <Text style={styles.hint}>
                  Görselleri sırayla ekle ({sequenceUris.length}/{MAX_SEQUENCE_STEPS})
                </Text>
              </View>
              <Pressable
                style={styles.galleryButton}
                onPress={() => setIsBuildingSequence(false)}
              >
                <Text style={styles.galleryButtonText}>Vazgeç</Text>
              </Pressable>
            </View>
            <View style={styles.sequenceSlots}>
              {sequenceUris.map((uri, index) => (
                <View key={`${uri}-${index}`} style={styles.sequenceSlot}>
                  <Animated.Image source={{ uri }} style={styles.sequenceThumbnail} />
                  <Text style={styles.sequenceNumber}>{index + 1}</Text>
                </View>
              ))}
              {sequenceUris.length < MAX_SEQUENCE_STEPS && (
                <Pressable style={styles.addStepButton} onPress={addSequenceStep}>
                  <Text style={styles.addStepText}>+ Adım ekle</Text>
                </Pressable>
              )}
            </View>
            <Pressable
              style={[styles.nextButton, sequenceUris.length === 0 && styles.disabledButton]}
              disabled={sequenceUris.length === 0}
              onPress={useSequence}
            >
              <Text style={styles.nextButtonText}>Bu diziyi kullan</Text>
            </Pressable>
          </View>
        ) : (
          <>
        <View style={styles.panelHeader}>
          <View>
            <Text style={styles.panelTitle}>
              {referenceMode === 'tutorial'
                ? `Adım ${currentStep + 1} / ${HEAD_DRAWING_STEPS.length}`
                : referenceMode === 'sequence'
                  ? `Özel dizi: ${currentStep + 1} / ${sequenceUris.length}`
                  : 'Serbest çizim'}
            </Text>
            <Text style={styles.hint}>
              {referenceMode === 'tutorial'
                ? HEAD_DRAWING_STEPS[currentStep]
                : referenceMode === 'sequence'
                  ? 'Dizindeki bir sonraki görsele geç'
                  : 'Galeriden seçilen görselde adım sistemi kullanılmaz'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            {referenceMode !== 'tutorial' && (
              <Pressable style={styles.galleryButton} onPress={returnToTutorial}>
                <Text style={styles.galleryButtonText}>Eğitime dön</Text>
              </Pressable>
            )}
            <Pressable style={styles.galleryButton} onPress={pickReferenceImage}>
              <Text style={styles.galleryButtonText}>Galeriden seç</Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          style={styles.sequenceButton}
          onPress={() => {
            setIsBuildingSequence(true);
            setReferenceMode('tutorial');
          }}
        >
          <Text style={styles.sequenceButtonText}>＋ Kendi eğitim dizini oluştur</Text>
        </Pressable>

        <View style={styles.sliderRow}>
          {/* Slider değeri 0.1-1 aralığında tutulur; böylece görsel hiçbir zaman tamamen kaybolmaz. */}
          <Text style={styles.sliderLabel}>Opaklık</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.1}
            maximumValue={1}
            value={opacity}
            onValueChange={setOpacity}
            minimumTrackTintColor="#65d6c3"
            maximumTrackTintColor="#53616b"
            thumbTintColor="#65d6c3"
          />
          <Text style={styles.percent}>{Math.round(opacity * 100)}%</Text>
        </View>

        {referenceMode !== 'custom' && (
          <View style={styles.navigation}>
            <Pressable
              style={[styles.stepButton, currentStep === 0 && styles.disabledButton]}
              disabled={currentStep === 0}
              onPress={() => setCurrentStep((step) => Math.max(0, step - 1))}
            >
              <Text style={styles.stepButtonText}>‹  Önceki</Text>
            </Pressable>
            <Pressable
              style={[
                styles.nextButton,
                currentStep ===
                  (referenceMode === 'tutorial'
                    ? HEAD_DRAWING_STEPS.length - 1
                    : sequenceUris.length - 1) && styles.disabledButton,
              ]}
              disabled={
                currentStep ===
                (referenceMode === 'tutorial'
                  ? HEAD_DRAWING_STEPS.length - 1
                  : sequenceUris.length - 1)
              }
              onPress={() =>
                setCurrentStep((step) =>
                  Math.min(
                    referenceMode === 'tutorial'
                      ? HEAD_DRAWING_STEPS.length - 1
                      : sequenceUris.length - 1,
                    step + 1,
                  ),
                )
              }
            >
              <Text style={styles.nextButtonText}>Sonraki adım  ›</Text>
            </Pressable>
          </View>
        )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1114' },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    padding: 24,
    backgroundColor: '#0b1114',
  },
  message: { color: '#dbe8e7', fontSize: 16 },
  title: { color: '#f5fffe', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  referenceImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '68%',
    top: '10%',
  },
  panel: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    paddingHorizontal: 18,
    paddingTop: 16,
    backgroundColor: 'rgba(11, 17, 20, 0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(101, 214, 195, 0.2)',
    gap: 12,
  },
  panelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sequenceBuilder: { gap: 12 },
  sequenceSlots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sequenceSlot: { width: 54, height: 66, borderRadius: 8, overflow: 'hidden', backgroundColor: '#263338' },
  sequenceThumbnail: { width: 54, height: 54 },
  sequenceNumber: { position: 'absolute', right: 4, bottom: 2, color: '#f5fffe', fontSize: 11, fontWeight: '800' },
  addStepButton: { width: 86, height: 66, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#65d6c3' },
  addStepText: { color: '#8ce9d8', fontSize: 11, fontWeight: '700', textAlign: 'center' },
  sequenceButton: { alignItems: 'center', paddingVertical: 9, borderRadius: 9, backgroundColor: '#1d3033' },
  sequenceButtonText: { color: '#8ce9d8', fontSize: 12, fontWeight: '700' },
  panelTitle: { color: '#f5fffe', fontSize: 17, fontWeight: '700' },
  hint: { color: '#9aacab', fontSize: 12, marginTop: 3 },
  galleryButton: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 9, backgroundColor: '#203b3d' },
  galleryButtonText: { color: '#8ce9d8', fontSize: 12, fontWeight: '700' },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sliderLabel: { color: '#dbe8e7', fontSize: 13 },
  slider: { flex: 1, height: 34 },
  percent: { color: '#8ce9d8', width: 38, textAlign: 'right', fontSize: 13, fontWeight: '700' },
  navigation: { flexDirection: 'row', gap: 10 },
  stepButton: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 10, backgroundColor: '#263338' },
  disabledButton: { opacity: 0.4 },
  stepButtonText: { color: '#dbe8e7', fontWeight: '700' },
  nextButton: { flex: 1.25, alignItems: 'center', paddingVertical: 13, borderRadius: 10, backgroundColor: '#65d6c3' },
  nextButtonText: { color: '#09201e', fontWeight: '800' },
  primaryButton: { borderRadius: 10, backgroundColor: '#65d6c3', paddingHorizontal: 20, paddingVertical: 14 },
  primaryButtonText: { color: '#09201e', fontWeight: '800' },
});
