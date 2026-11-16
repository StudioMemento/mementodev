import ctypes as C, re
from pathlib import Path
E=C.CDLL('libEGL.so.1'); P=C.c_void_p; I=C.c_int; U=C.c_uint
E.eglGetProcAddress.argtypes=[C.c_char_p];E.eglGetProcAddress.restype=P
def fn(n,ret,args):
 a=E.eglGetProcAddress(n.encode());assert a,n
 return C.CFUNCTYPE(ret,*args)(a)
platform=fn('eglGetPlatformDisplayEXT',P,[U,P,C.POINTER(I)])
d=platform(0x31DD,None,None)
init=fn('eglInitialize',U,[P,C.POINTER(I),C.POINTER(I)])
a,b=I(),I();assert init(d,C.byref(a),C.byref(b)),'EGL unavailable'
assert fn('eglBindAPI',U,[U])(0x30A0)
attrs=(I*13)(0x3024,8,0x3023,8,0x3022,8,0x3033,1,0x3040,0x40,0x3038,0,0)
config=P();n=I();assert fn('eglChooseConfig',U,[P,C.POINTER(I),C.POINTER(P),I,C.POINTER(I)])(d,attrs,C.byref(config),1,C.byref(n)) and n.value
surf=fn('eglCreatePbufferSurface',P,[P,P,C.POINTER(I)])(d,config,(I*5)(0x3057,1,0x3056,1,0x3038))
ctx=fn('eglCreateContext',P,[P,P,P,C.POINTER(I)])(d,config,None,(I*3)(0x3098,3,0x3038))
assert fn('eglMakeCurrent',U,[P,P,P,P])(d,surf,surf,ctx),'No GLES3 context'
create=fn('glCreateShader',U,[U]);source=fn('glShaderSource',None,[U,I,C.POINTER(C.c_char_p),C.POINTER(I)]);compile=fn('glCompileShader',None,[U]);status=fn('glGetShaderiv',None,[U,U,C.POINTER(I)]);log=fn('glGetShaderInfoLog',None,[U,I,C.POINTER(I),C.c_char_p])
program=fn('glCreateProgram',U,[]);attach=fn('glAttachShader',None,[U,U]);link=fn('glLinkProgram',None,[U]);linked=fn('glGetProgramiv',None,[U,U,C.POINTER(I)])
for name in ['DotGrid','MetallicPaint','Aurora','HoloCard']:
 text=(Path(__file__).resolve().parents[2] / ('src/vendor/v23-react-bits/'+name+'.tsx')).read_text();p=program()
 for field,kind in [('VERTEX',0x8B31),('FRAGMENT',0x8B30)]:
  src=re.search(r'const '+field+r' = `([\s\S]*?)`;',text)[1];src=re.sub(r'\$\{(\w+)\}',lambda m:re.search(r'const '+m[1]+r' = (\d+);',text)[1],src).encode();s=create(kind);ss=C.c_char_p(src);source(s,1,C.byref(ss),None);compile(s);ok=I();status(s,0x8B81,C.byref(ok))
  if not ok.value:
   buf=C.create_string_buffer(8192);log(s,8192,None,buf);raise AssertionError(name+' '+field+': '+buf.value.decode())
  attach(p,s)
 link(p);ok=I();linked(p,0x8B82,C.byref(ok));assert ok.value,name+' link failed'
 print(name+': GLSL ES 3.0 compile/link PASS')
