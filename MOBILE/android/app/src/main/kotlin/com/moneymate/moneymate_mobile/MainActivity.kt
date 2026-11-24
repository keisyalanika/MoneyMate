package com.moneymate.moneymate_mobile

import android.content.pm.PackageManager
import android.os.Build
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.security.MessageDigest

class MainActivity : FlutterActivity() {
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "moneymate/app_info")
            .setMethodCallHandler { call, result ->
                if (call.method == "signingInfo") {
                    try {
                        val pm = packageManager
                        val pkg = packageName
                        val signatures = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                            pm.getPackageInfo(pkg, PackageManager.GET_SIGNING_CERTIFICATES)
                                .signingInfo
                                ?.apkContentsSigners
                        } else {
                            @Suppress("DEPRECATION")
                            pm.getPackageInfo(pkg, PackageManager.GET_SIGNATURES)
                                .signatures
                        }

                        val cert = signatures?.firstOrNull()?.toByteArray()
                        result.success(
                            mapOf(
                                "packageName" to pkg,
                                "sha1" to cert?.let { digest(it, "SHA-1") },
                                "sha256" to cert?.let { digest(it, "SHA-256") },
                            )
                        )
                    } catch (e: Exception) {
                        result.error("SIGNING_INFO_ERROR", e.message, null)
                    }
                } else {
                    result.notImplemented()
                }
            }
    }

    private fun digest(bytes: ByteArray, algorithm: String): String {
        val digest = MessageDigest.getInstance(algorithm).digest(bytes)
        return digest.joinToString(":") { "%02X".format(it) }
    }
}
