declare module 'react-qr-scanner' {
    import { Component } from 'react';
  
    interface Props {
      delay?: number;
      onError?: (error: any) => void;
      onScan?: (data: string | null) => void;
      style?: React.CSSProperties;
      facingMode?: 'user' | 'environment';
      legacyMode?: boolean;
      resolution?: number;
      showViewFinder?: boolean;
    }
  
    export default class QRScanner extends Component<Props> {}
  }