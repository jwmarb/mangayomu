export interface RefreshableComponent {
  refresh: () => Promise<void>;
}
