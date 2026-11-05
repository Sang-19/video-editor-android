import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  Alert, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {pick, types} from '@react-native-documents/picker';
import {openVideoEditor, VideoEditorHost} from '@zlucksolutions/react-native-video-editor';

export default function App() {
  const [busy, setBusy] = useState(false);

  const chooseMedia = async () => {
    try {
      const [asset] = await pick({
        type: [types.video, types.images],
        allowMultiSelection: false,
        copyTo: 'cachesDirectory',
      });
      if (!asset?.uri) return;

      setBusy(true);
      const result = await openVideoEditor({
        source: asset.uri,
        editTrim: true,
        editCrop: true,
        editBGM: true,
        editTextOverlay: true,
        editVoiceOver: true,
      });

      if (result?.success) {
        Alert.alert('Export complete', result.exportedUri ?? 'Your edited media is ready.');
      } else if (result?.error) {
        Alert.alert('Editor', String(result.error));
      }
    } catch (error: any) {
      if (error?.code !== 'OPERATION_CANCELED') {
        Alert.alert('Unable to open media', error?.message ?? 'Please try another file.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#090909" />
      <ExpoStatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.brandMark}><Text style={styles.mark}>V</Text></View>
        <Text style={styles.title}>Lets edit videos</Text>
        <Text style={styles.subtitle}>Create something worth watching.</Text>
        <TouchableOpacity style={styles.primary} onPress={chooseMedia} disabled={busy} activeOpacity={0.85}>
          <Text style={styles.primaryText}>{busy ? 'PLEASE WAIT…' : 'SELECT VIDEO OR PHOTO'}</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Trim · Crop · Music · Text · Voice-over</Text>
      </View>
      <VideoEditorHost />
    </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#090909'},
  content: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28},
  brandMark: {width: 72, height: 72, borderRadius: 22, borderWidth: 2, borderColor: '#ff7a24', alignItems: 'center', justifyContent: 'center', marginBottom: 28},
  mark: {color: '#ff7a24', fontSize: 38, fontWeight: '900'},
  title: {color: '#fff', fontSize: 29, fontWeight: '800', letterSpacing: -0.8},
  subtitle: {color: '#929292', fontSize: 14, marginTop: 10, marginBottom: 38},
  primary: {width: '100%', minHeight: 58, borderRadius: 14, backgroundColor: '#ff7a24', alignItems: 'center', justifyContent: 'center'},
  primaryText: {color: '#111', fontSize: 14, fontWeight: '900', letterSpacing: 0.7},
  hint: {color: '#777', fontSize: 12, marginTop: 20},
});
