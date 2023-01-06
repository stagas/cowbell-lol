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
  'cut[50f..5k]=1400,
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

export const bassCode = String.raw`\\\ bass \\\
#:2,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y,
'cut[0.1f..5k]=487.103,
'q[.1..0.95]=0.868
)=(
  e=env(nt, 500, 20)
  *y;
  lpf(
    soft(saw(x/4)*e*3,0.5),
    cut+12k*e,
    q
  )
);
synth(
)=(
  x=tanh(#::play:sum*2.25);
  x
);
f()=synth();
`

export const kickCode = String.raw`\\\ kick \\\
#:2,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y,
  'pitch[1..100f]=43.573,
  'punch[0..500f]=280.567,
  'pdecay[1..50f]=36.044,
  'edecay[1..50f]=36.927,
  'verbfilt[100f..2k]=180.494,
  'pre[1f..30f]=13.112
)=(
  dt=t-nt;
  s=y*sine(pitch
    +punch
    *exp(-dt*pdecay),
     dt<0.003)
    *exp(-dt*edecay);
  s=tanh(s*pre);
  s=s+lpf(
    daverb(s)*.52,
    verbfilt,
    .7);
  s
);
f()=#::play:sum
`

export const beat1_4 = String.raw`/// 1/4 ///
bars=1
seed=1
on(1/4,x=>
  [x,127,127,.05])
`

export const algo1_4 = String.raw`/// 1/4 ///
bars=1
seed=1261
euc(1/14,8,(x,y,z)=>
  [x,12+
  ((t%4)*2)
  +rand(10)
  ,z*127+5,.05])
if (events[events.length-1][0]>0.9) {
  events.pop()
}
`

export const kick_1_4_brk_1 = String.raw`/// 1/4 brk 1 ///
bars=1
seed=1
on(1/8,x=>
  [x,127,127,.03])
events[1]=[]
events[3]=[]
events[6][0]+=1/(12/(t%3))
events[6][2]-=70
`

export const snare_1_2__1_4_brk_1 = String.raw`/// 1/2+1/4 brk 1 ///
bars=1
seed=1
on(1/2,x=>
  [x+1/4,127,127,.05])
events[1][0]+=1/(3*(t%4))
events.push([1/2+3/12,127,87,.05])
`

export const beat1_12 = String.raw`/// 1/4 ///
bars=1
seed=1
on(1/12,x=>
  [x,127,127,.03])
`

export const beat1_2__1_4 = String.raw`/// 1/2+1/4 ///
bars=1
seed=1
on(1/2,x=>
  [x+1/4,127,127,.05])
`

export const patternDefaultCode = String.raw`/// snare 1/2 ///
bars=2
seed=391434
on(1/4,delay(
   1/8,0.39,x=>
  rnd(10)<2?0:[x,
  24+rnd(5)**2,
  rnd(100)*3,0.1]))`

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
 'eatt[1..500f]=500,
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

export const demo = {
  kick: {
    sound: String.raw`\\\ kick \\\
#:1,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y,
  'pitch[1..100f]=51.023,
  'punch[0..500f]=190.711,
  'pdecay[1..50f]=46.586,
  'edecay[1..50f]=46.31,
  'pre[1f..30f]=2.102
)=(
  dt=t-nt;
  s=y*sine(pitch
    +punch
    *exp(-dt*pdecay),
      dt<0.003)
    *exp(-dt*edecay);
  s=tanh(s*pre);
  s
);
f()=#::play:sum
`, patterns: [String.raw`/// 1/4 ///
bars=1
seed=1
on(1/4,x=>
  [x,127,127,.05])
`,

    String.raw`/// 1/4 brk 1 ///
bars=1
seed=1
on(1/8,x=>
  [x,127,127,.03])
events[1]=[]
events[3]=[]
events[6][0]+=1/(12/(t%3))
events[6][2]-=70
`

    ]
  },

  snare: {
    sound: String.raw`\\\ snare \\\
#:2,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y,
  'eatt[1..500f]=199.757,
  'edec[1..50f]=3.552,
  'datt[1..500f]=397.812,
  'ddec[1..50f]=2.586,
  'nois[1..1000f]=899.467,
  'decay[20..500f]=43.547,
  'filt[1k..5k]=2176.634,
  'pre[1f..10f]=2.963,
  'post[1f..10f]=3.495
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
`,
    patterns: [String.raw`/// 1/2+1/4 ///
bars=1
seed=1
on(1/2,x=>
  [x+1/4,127,127,.05])
`,

    String.raw`/// 1/2+1/4 brk 1 ///
bars=1
seed=1
on(1/2,x=>
  [x+1/4,127,127,.05])
events[1][0]+=1/(3*(t%4))
events.push([1/2+3/12,127,87,.05])
`
    ]
  },

  bass: {
    sound: String.raw`\\\ bass \\\
#:2,3;
write_note(x,y)=(
  #=(t,note_to_hz(x),y/127);
  0
);
midi_in(op=0,x=0,y=0)=(
  op==144 && write_note(x,y)
);
play(nt,x,y,
'cut[0.1f..5k]=629.345,
'q[.1..0.95]=0.706
)=(
  e=env(nt, 20, 20+sine(1.25)*10)
  *y;
  lpf(
    soft(sqr(x/4)*e,0.5),
    cut+12k*e,
    q
  )
);
synth(
)=(
  x=tanh(#::play:sum*2.25);
  x
);
f()=synth();
`,

    patterns: [String.raw`/// 1/4 ///
bars=1
seed=91
euc(1/16,4,
  delay(1/4,8,
  (x,y,z)=>
  rand(10)<8?0:[x,17
  +scales.minor.pentatonic.get(
    rand(16)
  +(t%4===1?1:0)
  +(t%4===3?2:0)
  )
  ,z*127+25,.05]))
`]
  },

  reverb: {
    sound: String.raw`\\\
f()=sine(1);
`
    //     sound: String.raw`\\\ reverb \\\
    // fx(
    //   x,
    //   'mix[0..1f]=0.5
    // )=(
    //   daverb(
    //     x*mix
    //   )
    // );
    // f()=fx(#i(0));
    // `
  },

  main: String.raw`\\\ main \\\
const [kick,snare,bass,hats,keys] = players
const [reverb,delay] = sends

kick.in('350547'.sample.offset(-19231))
kick.out(reverb, .5)

keys
  .out(delay, .2)
  .out(reverb, .3)

loop(() => {
  bass.cut = sine(1/8)*.6+.2
})
`
}
