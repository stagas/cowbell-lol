export const monoDefaultEditorValue = `\\\\\\ bass \\\\\\
#:2,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y)=(
  saw(x/4)*env(nt, 100, 30)*y
);
synth(
  'cut[50f..5k]=500,
  'q[.1..0.95]=0.125
)=(
  x=tanh(
    lpf(
      #::play:sum*5,
      cut+300*sine(.125),
      q
    )*3
  );
  x=x+daverb(x)*0.4;
  x
);
f()=synth();
`

export const patternDefaultCode = String.raw`/// snare 1/2 ///
bars=2
seed=391434
on(1/4,delay(
   1/8,0.39,x=>
  rnd(10)<2?0:[x,
  24+rnd(5)**2,
  rnd(100)*3,0.1]))
`

export const patternDefaultCode2 = String.raw`/// bassline techno ///
bars=2
seed=404
on(1/4,delay(
   1/8,0.39,x=>
  rnd(10)<2?0:[x,
  24+rnd(5)**2,
  rnd(100)*3,0.1]))
`

export const snareCode = String.raw`\\\ snare \\\
#:2,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y,
 'eatt[1..500f]=33.115,
 'edec[1..500f]=50.396,
 'datt[1..500f]=500,
 'ddec[1..500f]=72.286,
 'nois[1..1000f]=53.184,
 'filt[1k..5k]=4295.815
)=(
  e=env(nt, eatt, edec);
  d=env(nt, datt, ddec);
  z=noise(nois*d)*d+tri(420+x)*e;
  s=lpf(tanh(z*5)*y, filt, 0.55);
  s*.8+freeverb(s,.85,.35)*.45
);
f()=(
  x=#::play:sum;
  x*.35
)
`

export const snareCode2 = String.raw`\\\ snare \\\
#:2,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y,
 'eatt[1..500f]=500,
 'edec[1..50f]=19.55,
 'datt[1..500f]=500,
 'ddec[1..50f]=11.15,
 'nois[1..1000f]=315.409,
 'decay[20..500f]=43.547,
 'filt[1k..5k]=3815.151,
 'pre[1f..10f]=1.27,
 'post[1f..10f]=5.333
)=(
  e=env(nt, eatt, edec);
  d=env(nt, datt, ddec);
  z=noise(nois*d)*d+tri(420+x)*e;
  s=lpf(tanh(z*5)*y, filt, 0.55);
  s=s*.8+freeverb(s,.85,.35)*.45;
  tanh(s*pre)*post*env(nt,200,decay)
);
f()=(
  x=#::play:sum;
  x*.35
)
`
