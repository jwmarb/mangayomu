import { ResolvedImageAsset } from '@/utils/image';
import {
  Gesture,
  PinchGesture,
  type GestureStateChangeEvent,
  type GestureUpdateEvent,
  type NativeGesture,
  type PinchGestureChangeEventPayload,
  type PinchGestureHandlerEventPayload,
  type TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { runOnJS, runOnUI } from 'react-native-reanimated';

export type GestureEvents = {
  onFlatListInteraction: () => void;
  onPinchChange: (
    e: GestureUpdateEvent<
      PinchGestureHandlerEventPayload & PinchGestureChangeEventPayload
    >,
  ) => void;
  onDoubleTap: (
    e: GestureStateChangeEvent<TapGestureHandlerEventPayload>,
  ) => void;
};

class GestureManager {
  private pages: Record<string, GestureEvents>;
  private currentPage: ResolvedImageAsset | null;
  private flatListGesture: NativeGesture | null;
  private pinchGesture: PinchGesture | null;
  public constructor() {
    this.pages = {};
    this.currentPage = null;
    this.flatListGesture = null;
    this.pinchGesture = null;
  }

  public subscribe(page: ResolvedImageAsset) {
    if (page.uri in this.pages === false) {
      this.pages[page.uri] = {} as GestureEvents;
    }
    return {
      on: <T extends keyof GestureEvents>(
        eventType: T,
        fn: GestureEvents[T],
      ) => {
        this.pages[page.uri][eventType] = fn;
      },
      unsubscribe: () => {
        delete this.pages[page.uri];
      },
    };
  }

  public cleanup() {
    this.pages = {};
    this.currentPage = null;
    this.flatListGesture = null;
    this.pinchGesture = null;
  }

  public setCurrentPage(page: ResolvedImageAsset) {
    this.currentPage = page;
  }

  /**
   * Invokes the specified gesture event handler for the current page.
   *
   * This method checks if there is a valid current page and whether the specified event type is registered for that page.
   * If both conditions are met, it retrieves the corresponding event handler function and invokes it on the UI thread.
   * The event handler is passed the provided event object as an argument.
   *
   * @pre    - `this.currentPage` must not be null.
   *         - The `eventType` must be a valid key in the gesture events map for the current page's URI.
   *         - The function must be contain "worklet"; to be ran on the UI-thread
   * @post   - If conditions are met, the corresponding event handler is invoked on the UI thread.
   *           Otherwise, no action is taken and the method returns immediately.
   *
   * @param eventType  The type of the gesture event to invoke. This must be a key in the `GestureEvents` map.
   * @param e          The event object to pass to the event handler function. The type of this parameter matches the expected
   *                   type for the specified `eventType`.
   */
  public invoke<T extends keyof GestureEvents>(
    eventType: T,
    e: Parameters<GestureEvents[T]>[0],
  ) {
    // Check if there is no current page or if the event type is not registered for the current page.
    if (
      this.currentPage === null ||
      this.currentPage.uri in this.pages === false ||
      eventType in this.pages[this.currentPage.uri] === false
    )
      return;

    const fn = this.pages[this.currentPage.uri][eventType];
    // Run the gesture handler on the UI thread to ensure smooth performance.
    runOnUI(fn as any)(e as any);
  }

  /**
   * Creates and initializes shared gesture recognizers for flat list interaction and pinch-to-zoom.
   *
   * This method ensures that the gestures are only created once. It sets up a native gesture recognizer
   * for handling interactions with the flat list and a pinch gesture recognizer for zooming. The flat
   * list gesture toggles pan interactions for all pages, while the pinch gesture invokes specific events
   * on the current page.
   *
   * @pre    This method should be called at the beginning of the Reader component
   * @post   The `flatListGesture` and `pinchGesture` properties are initialized with gesture event listeners.
   *         These gestures will handle flat list interactions and pinch-to-zoom, respectively.
   */
  public createSharedGestures() {
    // Ensure that the gestures are only created once
    if (this.flatListGesture == null && this.pinchGesture == null) {
      const togglePanForAllPages = () => {
        for (const key in this.pages) {
          this.pages[key].onFlatListInteraction();
        }
      };

      // Helper function to invoke gesture events on the current page
      const pinchEvent: typeof this.invoke = (eventType, e) => {
        this.invoke(eventType, e);
      };

      // Create a native gesture for flat list interaction
      this.flatListGesture = Gesture.Native().onBegin(() => {
        runOnJS(togglePanForAllPages)();
      });

      // Create a pinch gesture to handle zooming
      this.pinchGesture = Gesture.Pinch()
        .onChange((e) => {
          runOnJS(pinchEvent)('onPinchChange', e);
        })
        .blocksExternalGesture(this.flatListGesture); // Block flat list gestures when pinching
    }
  }

  public getFlatListGesture() {
    return this.flatListGesture!;
  }

  public getPinchGesture() {
    return this.pinchGesture!;
  }
}

export default new GestureManager();
