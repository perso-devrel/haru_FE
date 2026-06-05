import { Modal, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePhotoEditorStore } from '@/stores/photoEditorStore';
import { PhotoEditor } from './PhotoEditor';

// Root-level host (mounted once in _layout.tsx). Renders the editor as a
// full-screen modal whenever a request is open and resolves the awaiting
// promise via the store's finish().
export function PhotoEditorHost() {
  const request = usePhotoEditorStore((s) => s.request);
  const finish = usePhotoEditorStore((s) => s.finish);

  return (
    <Modal
      visible={request !== null}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => finish(null)}
    >
      {request ? (
        // RN Modal renders in a separate native view tree, so the root
        // GestureHandlerRootView (_layout) doesn't reach inside it — wrap the
        // editor in its own root or the pan/pinch gestures won't fire.
        <GestureHandlerRootView style={styles.root}>
          <PhotoEditor
            uri={request.uri}
            onComplete={(editedUri) => finish(editedUri)}
            onCancel={() => finish(null)}
          />
        </GestureHandlerRootView>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
