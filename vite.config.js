import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Remove chunkSizeWarningLimit (it only changes warning threshold).
    // Use manualChunks to split vendors into smaller bundles so minification
    // & bundling use less memory and chunks stay under limits.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          // Resolve the package name (handles scopes and nested node_modules)
          const pkgPath = id.split('node_modules/').pop() || ''
          const pkg = pkgPath.startsWith('@')
            ? pkgPath.split('/').slice(0, 2).join('/')
            : pkgPath.split('/')[0]

          // Only the React runtime goes into the react chunk. Matching on the
          // "react" substring used to pull in react-quill-new, @radix-ui/react-*
          // and friends, which created circular chunks.
          if (pkg === 'react' || pkg === 'react-dom' || pkg === 'scheduler') {
            return 'vendor.react'
          }
          if (pkg === 'lodash' || pkg === 'lodash-es') return 'vendor.lodash'
          // rich-text editor stack (only pulls in React + lodash, both already
          // in their own chunks, so no circular imports)
          if (
            pkg === 'quill' ||
            pkg === 'quill-delta' ||
            pkg === 'parchment' ||
            pkg === 'eventemitter3' ||
            pkg === 'react-quill-new'
          ) {
            return 'vendor.editor'
          }
          // group other large libs into a vendor chunk
          return 'vendor'
        },
      },
    },
  },
})
