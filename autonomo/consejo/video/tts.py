import ctypes, wave, sys, espeakng_loader as E
lib=ctypes.CDLL(E.get_library_path())
CB=ctypes.CFUNCTYPE(ctypes.c_int,ctypes.POINTER(ctypes.c_short),ctypes.c_int,ctypes.c_void_p)
buf=[]
def cb(w,n,ev):
    if n>0: buf.append(ctypes.string_at(w,n*2))
    return 0
cbf=CB(cb)
sr=lib.espeak_Initialize(1,500,E.get_data_path().encode(),0)
lib.espeak_SetSynthCallback(cbf)
def say(text,voice,rate,pitch,rng,out):
    buf.clear()
    lib.espeak_SetVoiceByName(voice.encode())
    lib.espeak_SetParameter(1,rate,0); lib.espeak_SetParameter(3,pitch,0); lib.espeak_SetParameter(4,rng,0)
    b=text.encode('utf-8')+b'\0'
    lib.espeak_Synth(b,len(b),0,1,0,1,None,None); lib.espeak_Synchronize()
    with wave.open(out,'wb') as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes(b''.join(buf))
if __name__=='__main__':
    say(sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4]),int(sys.argv[5]),sys.argv[6])
