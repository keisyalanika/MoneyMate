import 'package:intl/intl.dart';

class CurrencyFormatter {
  static String formatRupiah(num val) {
    final NumberFormat currencyFormatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    return currencyFormatter.format(val);
  }
}
