import 'package:flutter/material.dart';

class NotificationHelper {
  static void showTopNotification(
    BuildContext context,
    String message, {
    bool isError = false,
    String? title,
    VoidCallback? onTap,
  }) {
    final overlay = Overlay.of(context, rootOverlay: true);
    final hasTitle = title != null && title.trim().isNotEmpty;
    late OverlayEntry overlayEntry;
    var removed = false;

    void remove() {
      if (removed) return;
      removed = true;
      overlayEntry.remove();
    }

    overlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        top: MediaQuery.of(context).padding.top + 10,
        left: 20,
        right: 20,
        child: Material(
          color: Colors.transparent,
          child: GestureDetector(
            onTap: onTap == null
                ? null
                : () {
                    remove();
                    onTap();
                  },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: isError
                    ? Colors.red.shade800
                    : hasTitle
                        ? Colors.white
                        : const Color(0xFFE8F8F0),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.1),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
                border: Border.all(
                  color: isError
                      ? Colors.red
                      : hasTitle
                          ? const Color(0xFFEADFD5)
                          : Colors.teal.shade200,
                  width: 1,
                ),
              ),
              child: Row(
                crossAxisAlignment:
                    hasTitle ? CrossAxisAlignment.start : CrossAxisAlignment.center,
                children: [
                  Icon(
                    hasTitle
                        ? Icons.campaign_outlined
                        : (isError
                            ? Icons.error_outline
                            : Icons.check_circle_outline),
                    color: isError
                        ? Colors.white
                        : hasTitle
                            ? const Color(0xFF8C381E)
                            : Colors.teal,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: hasTitle
                        ? Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  color: Color(0xFF2C1A14),
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              if (message.trim().isNotEmpty) ...[
                                const SizedBox(height: 2),
                                Text(
                                  message,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    color: Color(0xFF6B4E44),
                                    fontSize: 12,
                                    height: 1.3,
                                  ),
                                ),
                              ],
                              if (onTap != null) ...[
                                const SizedBox(height: 4),
                                const Text(
                                  'Ketuk untuk lihat detail',
                                  style: TextStyle(
                                    color: Color(0xFF8C381E),
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ],
                          )
                        : Text(
                            message,
                            style: TextStyle(
                              color: isError ? Colors.white : const Color(0xFF2C1A14),
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );

    overlay.insert(overlayEntry);

    Future.delayed(Duration(seconds: hasTitle ? 5 : 3), remove);
  }
}
