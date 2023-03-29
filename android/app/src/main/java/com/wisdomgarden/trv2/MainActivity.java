package com.wisdomgarden.trv2;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;


public class MainActivity extends BridgeActivity {

    // workaround for removing deleted tags from future requests
    private void clearOneSignalUserState() {
        Context context = this.getApplicationContext();
        SharedPreferences mContextSp = context.getSharedPreferences("OneSignal", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = mContextSp.edit();
        editor.remove("ONESIGNAL_USERSTATE_SYNCVALYES_emailTOSYNC_STATE");
        editor.remove("ONESIGNAL_USERSTATE_SYNCVALYES_TOSYNC_STATE");
        editor.remove("ONESIGNAL_USERSTATE_SYNCVALYES_CURRENT_STATE");
        editor.commit();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        this.clearOneSignalUserState();
        super.onCreate(savedInstanceState);
    }
}
