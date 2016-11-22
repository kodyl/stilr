declare module 'stilr' {
  namespace Stilr {
    type StyleSheet = Map<string, any>;

    function create(styles: any, stylesheet?: StyleSheet): any;
    function render(options?: Object, stylesheet?: StyleSheet): string;
    function clear(stylesheet: StyleSheet): Boolean;
  }

  export = Stilr;
}
