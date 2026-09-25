import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { buttonInk, type Design } from './model';

export const escapeHtml = (text: string) => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
export function htmlExport(design: Design): string {
  const t = design.theme;
  const sections = design.screens.map((screen, i) => `<section id="${escapeHtml(screen.id)}" ${i ? 'hidden' : ''}>${screen.nodes.map(n => {
    const text = escapeHtml(n.text), detail = escapeHtml(n.detail);
    const attrs = n.target ? ` data-target="${escapeHtml(n.target)}"` : '';
    switch (n.type) {
      case 'heading': return `<h1>${text}</h1>`;
      case 'text': return `<p>${text}</p>`;
      case 'input': return `<label>${text}<input placeholder="${detail}"></label>`;
      case 'image': return `<div class="visual" role="img" aria-label="${text}">${text}<small>Image placeholder</small></div>`;
      case 'card': return n.target ? `<button class="card"${attrs}><strong>${text}</strong><p>${detail}</p></button>` : `<article class="card"><strong>${text}</strong><p>${detail}</p></article>`;
      default: return `<button class="${n.type}"${attrs}>${text}</button>`;
    }
  }).join('\n')}</section>`).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(design.name)}</title><style>*{box-sizing:border-box}body{margin:0;background:${t.background};color:${t.text};font:${t.fontSize}px/1.6 system-ui}main{max-width:480px;margin:auto;padding:24px}section:not([hidden]){display:grid;gap:${t.spacing}px}h1{font-size:32px;line-height:1.15;margin:12px 0}p{margin:0}button,input,.card,.visual{font:inherit;border-radius:${t.radius}px;padding:16px;min-height:48px}button{cursor:pointer;border:0;background:${t.primary};color:${buttonInk(t.primary)}}.card{display:block;width:100%;text-align:left;background:${t.surface};color:${t.text}}input{display:block;width:100%;border:1px solid currentColor;background:${t.surface};color:${t.text}}.navigation{background:transparent;color:${t.text};text-decoration:underline}.visual{min-height:180px;background:${t.primary};color:${buttonInk(t.primary)};display:grid;place-content:center;text-align:center}small{display:block}*:focus-visible{outline:3px solid ${t.primary};outline-offset:4px}aside{text-align:center;padding:12px;font-size:12px}</style></head><body><aside>DesignFlow interactive prototype · form data is not submitted</aside><main>${sections}</main><script>document.addEventListener('click',e=>{const b=e.target.closest('[data-target]');if(!b)return;const target=document.getElementById(b.dataset.target);if(!target)return;document.querySelectorAll('section').forEach(s=>s.hidden=s!==target);window.scrollTo(0,0)});</script></body></html>`;
}
export function reactNativeExport(design: Design): string {
  // JSON data stays outside JSX, so braces, quotes and markup remain plain text.
  const data = JSON.stringify(design, null, 2);
  return `import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
const design = ${data};
export default function App() {
  const [screenId, setScreenId] = useState(design.screens[0].id);
  const screen = design.screens.find(s => s.id === screenId) || design.screens[0];
  return <SafeAreaView style={styles.root}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.notice}>Interactive prototype · entries are preview-only</Text>
    {screen.nodes.map(n => {
      if(n.type === 'input') return <View key={n.id}><Text style={styles.text}>{n.text}</Text><TextInput accessibilityLabel={n.text} placeholder={n.detail} placeholderTextColor={design.theme.text} style={styles.input}/></View>;
      if(n.type === 'heading') return <Text key={n.id} accessibilityRole="header" style={styles.heading}>{n.text}</Text>;
      if(n.type === 'text') return <Text key={n.id} style={styles.text}>{n.text}</Text>;
      if(n.type === 'image') return <View key={n.id} style={styles.visual}><Text style={styles.text}>{n.text}</Text><Text style={styles.text}>Image placeholder</Text></View>;
      const card = n.type === 'card';
      return <Pressable key={n.id} accessibilityRole={n.target ? 'button' : undefined} disabled={!n.target} onPress={()=>setScreenId(n.target)} style={card ? styles.card : styles.button}><Text style={card ? styles.text : styles.buttonText}>{n.text}</Text>{!!n.detail && <Text style={styles.text}>{n.detail}</Text>}</Pressable>;
    })}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
 root:{flex:1,backgroundColor:design.theme.background},content:{padding:24,gap:design.theme.spacing},
 text:{color:design.theme.text,fontSize:design.theme.fontSize},notice:{color:design.theme.text,fontSize:12},
 heading:{color:design.theme.text,fontSize:32,fontWeight:'700'},
 card:{padding:20,borderRadius:design.theme.radius,backgroundColor:design.theme.surface,minHeight:48},
 button:{padding:16,borderRadius:design.theme.radius,backgroundColor:design.theme.primary,minHeight:48},
 buttonText:{color:${JSON.stringify(buttonInk(design.theme.primary))},fontSize:design.theme.fontSize,fontWeight:'600',textAlign:'center'},
 input:{padding:16,borderRadius:design.theme.radius,borderWidth:1,borderColor:design.theme.text,color:design.theme.text,fontSize:design.theme.fontSize},
 visual:{padding:32,minHeight:180,justifyContent:'center',alignItems:'center',backgroundColor:design.theme.surface,borderRadius:design.theme.radius}
});
`;
}
export async function exportFile(filename: string, content: string, mime = 'application/json') {
  if (Capacitor.isNativePlatform()) {
    const saved = await Filesystem.writeFile({ path: filename, data: content, directory: Directory.Cache, encoding: Encoding.UTF8 });
    await Share.share({ title: filename, files: [saved.uri], dialogTitle: 'Save or share your export' });
  } else {
    const url = URL.createObjectURL(new Blob([content], { type: mime }));
    const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
}
