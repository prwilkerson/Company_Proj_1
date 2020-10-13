
"use strict";

var g_s = null;

class Constants {
   static NUM_OF_STOCKS = 200;
   static NUM_OF_CURRENCIES = 200;
   static NUM_OF_MOCKS = Constants.NUM_OF_STOCKS + Constants.NUM_OF_CURRENCIES;

   static MOCK_FIELD_INDEX_0 = 0;
   static MOCK_FIELD_INDEX_1 = 1;
   static MOCK_FIELD_INDEX_2 = 2;
   static MOCK_FIELD_INDEX_3 = 3;
   static MOCK_FIELD_INDEX_4 = 4;
   static MOCK_FIELD_INDEX_5 = 5;

   static FIELD_SEP = "_";

   static MOCK_FIELD_NAME_BASE = "mockData_";

   static MOCK_ROW_NAME = "mockId_";

   static MOCK_COL_NAMES = [ "Fav", "ID", "Asset Name", "Price", "Last Update", "Type" ];

   static MAX_COLUMNS = Constants.MOCK_COL_NAMES.length;

   static ASSET_TYPE_STOCK = "Stock";
   static ASSET_TYPE_CURRENCY = "Currency";
   static ASSET_STOCK_TYPES = [ "AAPL", "FB", "GOOGL", "MSFT", "TSLA" ];
   static ASSET_STOCK_CURRENCIES = [ "AUD", "EUR", "GBP", "NIS", "USD" ];

   static PRICE_MIN = 1;
   static PRICE_MAX = 99;

   static RUNTIME_INTERVALIN_MS = 1000;
}

class Helper {
   static formatDate( d_date ) {
      var sz_date = "" + d_date.getFullYear( ) + "-";
      var sz_temp = "" + ( d_date.getMonth( ) + 1 );

      if ( sz_temp.length < 2 ) {
         sz_temp = "0" + sz_temp;
      }

      sz_date += sz_temp + "-";
      sz_temp = "" + d_date.getDate( );

      if ( sz_temp.length < 2 ) {
         sz_temp = "0" + sz_temp;
      }

      sz_date += sz_temp + "&nbsp;&nbsp;&nbsp;";
      sz_temp = "" + d_date.getHours( );

      if ( sz_temp.length < 2 ) {
         sz_temp = "0" + sz_temp;
      }

      sz_date += sz_temp + ":";
      sz_temp = "" + d_date.getMinutes( );

      if ( sz_temp.length < 2 ) {
         sz_temp = "0" + sz_temp;
      }

      sz_date += sz_temp + ":";
      sz_temp = "" + d_date.getSeconds( );

      if ( sz_temp.length < 2 ) {
         sz_temp = "0" + sz_temp;
      }

      sz_date += sz_temp + ".";
      sz_temp = "" + d_date.getMilliseconds( );

      while ( sz_temp.length < 3 ) {
         sz_temp = "0" + sz_temp;
      }

      sz_date += sz_temp;

      return sz_date;
   }
}

class Mock {
   constructor( i_asset_id, sz_asset_type ) {
      this.b_isFavorite = false;
      this.i_id = i_asset_id;

      if ( sz_asset_type === Constants.ASSET_TYPE_STOCK ) {
         this.sz_assetName = Constants.ASSET_STOCK_TYPES[ Math.floor( Math.random( ) *
            Constants.ASSET_STOCK_TYPES.length ) ];
      }
      else {
         this.sz_assetName = Constants.ASSET_STOCK_CURRENCIES[ Math.floor( Math.random( ) *
            Constants.ASSET_STOCK_CURRENCIES.length ) ];
      }

      this.i_price = Math.trunc( Math.random( ) * Constants.PRICE_MAX ) + Constants.PRICE_MIN;
      this.d_lastUpdate = new Date( );
      this.sz_type = sz_asset_type;
   }
}

class Solution {
   constructor( ) {
      this.amMocks = [ ];
      this.iSortedField = Constants.MOCK_FIELD_INDEX_1;
      this.bIsSortAscending = true;
      this.iIntervalID = null;
      this.iMockIter = 0;
      this.afMockAscendingCompare = [ ];
      this.afMockDescendingCompare = [ ];

      this.afMockAscendingCompare[ Constants.MOCK_FIELD_INDEX_0 ] = this.compareNoSort;
      this.afMockAscendingCompare[ Constants.MOCK_FIELD_INDEX_1 ] = this.compareMockIDAscending;
      this.afMockAscendingCompare[ Constants.MOCK_FIELD_INDEX_2 ] = this.compareMockAssetNameAscending;
      this.afMockAscendingCompare[ Constants.MOCK_FIELD_INDEX_3 ] = this.compareMockPriceAscending;
      this.afMockAscendingCompare[ Constants.MOCK_FIELD_INDEX_4 ] = this.compareMockLastUpdateAscending;
      this.afMockAscendingCompare[ Constants.MOCK_FIELD_INDEX_5 ] = this.compareMockTypeAscending;
      this.afMockDescendingCompare[ Constants.MOCK_FIELD_INDEX_0 ] = this.compareNoSort;
      this.afMockDescendingCompare[ Constants.MOCK_FIELD_INDEX_1 ] = this.compareMockIDDescending;
      this.afMockDescendingCompare[ Constants.MOCK_FIELD_INDEX_2 ] = this.compareMockAssetNameDescending;
      this.afMockDescendingCompare[ Constants.MOCK_FIELD_INDEX_3 ] = this.compareMockPriceDescending;
      this.afMockDescendingCompare[ Constants.MOCK_FIELD_INDEX_4 ] = this.compareMockLastUpdateDescending;
      this.afMockDescendingCompare[ Constants.MOCK_FIELD_INDEX_5 ] = this.compareMockTypeDescending;

      this.initMocks( );
      this.initTables( );
   }

   initMocks( ) {
      var i_asset_id = 0;
      var i_iter;
      var m_mock;

      for ( i_iter = 0; i_iter < Constants.NUM_OF_STOCKS; ++i_iter ) {
         m_mock = new Mock( i_asset_id, Constants.ASSET_TYPE_STOCK );
         ++i_asset_id;
         this.amMocks.push( m_mock );
      }

      for ( i_iter = 0; i_iter < Constants.NUM_OF_CURRENCIES; ++i_iter ) {
         m_mock = new Mock( i_asset_id, Constants.ASSET_TYPE_CURRENCY );
         ++i_asset_id;
         this.amMocks.push( m_mock );
      }
   }

   onRowClicked( e_evt ) {
      var sz_row_id = e_evt.currentTarget.id.substr( Constants.MOCK_ROW_NAME.length );
      var sz_field = Constants.MOCK_FIELD_NAME_BASE + Constants.MOCK_FIELD_INDEX_1 + Constants.FIELD_SEP + sz_row_id;
      var e_elem = document.getElementById( sz_field );
      var sz_id = e_elem.innerHTML;
   }

   initCols( i_table_indx ) {
      var t_table = document.getElementById( "table" + i_table_indx );
      var sz_col_name = Constants.MOCK_FIELD_NAME_BASE + i_table_indx + Constants.FIELD_SEP;
      var callback = this;
      var i_len = this.amMocks.length;
      var e_tr;
      var e_td;
      var e_span;
      var i_iter;
      var m_mock;
      var d_date;
      var o_mock_val;

      for ( i_iter = 0; i_iter < i_len; ++i_iter ) {
         e_tr = document.createElement( "tr" );
         e_tr.id = Constants.MOCK_ROW_NAME + i_iter;
         e_tr.className = "trMockRow" + ( i_iter & 0x1 );
         e_tr.addEventListener("mousedown", function( e ) { callback.onRowClicked( e ); } );
         e_td = document.createElement( "td" );
         e_span = document.createElement( "span" );
         e_span.id = sz_col_name + i_iter;
         m_mock = this.amMocks[ i_iter ];

         switch ( i_table_indx ) {
            case Constants.MOCK_FIELD_INDEX_0:
               if ( m_mock.b_isFavorite ) {
                  o_mock_val = "&hearts;";
               }
               else {
                  o_mock_val = "&nbsp;";
               }
               break;

            case Constants.MOCK_FIELD_INDEX_1:
               o_mock_val = m_mock.i_id;
               break;

            case Constants.MOCK_FIELD_INDEX_2:
               o_mock_val = m_mock.sz_assetName;
               break;

            case Constants.MOCK_FIELD_INDEX_3:
               o_mock_val = m_mock.i_price;
               break;

            case Constants.MOCK_FIELD_INDEX_4:
               o_mock_val = Helper.formatDate( m_mock.d_lastUpdate );
               break;

            case Constants.MOCK_FIELD_INDEX_5:
               o_mock_val = m_mock.sz_type;
               break;
         }

         e_span.innerHTML = o_mock_val;
         e_td.appendChild( e_span );
         e_tr.appendChild( e_td );
         t_table.insertAdjacentElement( "beforeend", e_tr );
      }
   }

   initTables( ) {
      var i_iter;

      for ( i_iter = Constants.MOCK_FIELD_INDEX_0; i_iter < Constants.MAX_COLUMNS; ++i_iter ) {
         this.initCols( i_iter );
      }
   }
   
   onCheckBoxClick( i_index ) {
      var cb = document.getElementById( "chkBx" + i_index );
      var d_div = document.getElementById( "mockDiv" + i_index );
      var sz_disp;

      if ( cb.checked ) {
         sz_disp = "block";
      }
      else {
         sz_disp = "none";
      }

      d_div.style.display = sz_disp;
   }

   compareNoSort( a, b ) {
      return 0;
   }

   compareMockIDAscending( a, b ) {
      return a.i_id - b.i_id;
   }

   compareMockIDDescending( a, b ) {
      return b.i_id - a.i_id;
   }

   compareMockPriceAscending( a, b ) {
      return a.i_price - b.i_price;
   }

   compareMockPriceDescending( a, b ) {
      return b.i_price - a.i_price;
   }

   compareMockAssetNameAscending( a, b ) {
      return a.sz_assetName.localeCompare( b.sz_assetName );
   }

   compareMockAssetNameDescending( a, b ) {
      return b.sz_assetName.localeCompare( a.sz_assetName );
   }

   compareMockTypeAscending( a, b ) {
      return a.sz_type.localeCompare( b.sz_type );
   }

   compareMockTypeDescending( a, b ) {
      return b.sz_type.localeCompare( a.sz_type );
   }

   compareMockLastUpdateAscending( a, b ) {
      return a.d_lastUpdate.getTime( ) - b.d_lastUpdate.getTime( );
   }

   compareMockLastUpdateDescending( a, b ) {
      return b.d_lastUpdate.getTime( ) - a.d_lastUpdate.getTime( );
   }

   displayPriceLastUpdate( i_index ) {
      var m_mock = this.amMocks[ i_index ];
      var sz_elem_name = Constants.MOCK_FIELD_NAME_BASE + Constants.MOCK_FIELD_INDEX_3 + Constants.FIELD_SEP + i_index;
      var e_elem = document.getElementById( sz_elem_name );

      e_elem.innerHTML = "" + m_mock.i_price;

      sz_elem_name = Constants.MOCK_FIELD_NAME_BASE + Constants.MOCK_FIELD_INDEX_4 + Constants.FIELD_SEP + i_index;
      e_elem = document.getElementById( sz_elem_name );
      e_elem.innerHTML = Helper.formatDate( m_mock.d_lastUpdate );
   }

   displayRow( i_index ) {
      var m_mock = this.amMocks[ i_index ];
      var sz_elem_name = Constants.MOCK_FIELD_NAME_BASE + Constants.MOCK_FIELD_INDEX_0 + Constants.FIELD_SEP + i_index;
      var e_elem = document.getElementById( sz_elem_name );

      e_elem.innerHTML = "&nbsp;";

      sz_elem_name = Constants.MOCK_FIELD_NAME_BASE + Constants.MOCK_FIELD_INDEX_1 + Constants.FIELD_SEP + i_index;
      e_elem = document.getElementById( sz_elem_name );
      e_elem.innerHTML = "" + m_mock.i_id;

      sz_elem_name = Constants.MOCK_FIELD_NAME_BASE + Constants.MOCK_FIELD_INDEX_2 + Constants.FIELD_SEP + i_index;
      e_elem = document.getElementById( sz_elem_name );
      e_elem.innerHTML = m_mock.sz_assetName;

      this.displayPriceLastUpdate( i_index );

      sz_elem_name = Constants.MOCK_FIELD_NAME_BASE + Constants.MOCK_FIELD_INDEX_5 + Constants.FIELD_SEP + i_index;
      e_elem = document.getElementById( sz_elem_name );
      e_elem.innerHTML = m_mock.sz_type;
   }

   displayMockTable( ) {
      var i_len = this.amMocks.length;
      var i_iter;

      for ( i_iter = 0; i_iter < i_len; ++i_iter ) {
         this.displayRow( i_iter );
      }
   }

   sortMockData( ) {
      var f_comp;

      if ( this.bIsSortAscending ) {
         f_comp = this.afMockAscendingCompare[ this.iSortedField ];
      }
      else {
         f_comp = this.afMockDescendingCompare[ this.iSortedField ];
      }

      this.amMocks.sort( f_comp );
      this.displayMockTable( );
   }

   onSortSelected( i_index ) {
      var th_head = document.getElementById( "mockHead" + this.iSortedField );
      var sz_field_name;

      this.iMockIter = 0;

      if ( this.iSortedField == i_index ) {
         this.bIsSortAscending = !this.bIsSortAscending;
         sz_field_name = Constants.MOCK_COL_NAMES[ this.iSortedField ] + "&nbsp;";

         if ( this.bIsSortAscending ) {
            sz_field_name += "&darr;";
         }
         else {
            sz_field_name += "&uarr;";
         }

         th_head.innerHTML = sz_field_name;
      }
      else {
         th_head.innerHTML = Constants.MOCK_COL_NAMES[ this.iSortedField ];
         this.bIsSortAscending = true;
         this.iSortedField = i_index;
         th_head = document.getElementById( "mockHead" + this.iSortedField );
         th_head.innerHTML = Constants.MOCK_COL_NAMES[ this.iSortedField ] + "&nbsp;&darr;";
      }

      this.sortMockData( );
   }

   onRunInterval( ) {
      var m_mock = this.amMocks[ this.iMockIter ];
      var i_ran_val;
      var i_chg_val;

      // Do not let the price to fall below 1
      do {
         i_ran_val = Math.floor( Math.random( ) * 2);
         i_chg_val = ( i_ran_val == 1 ) ? 1 : -1;
      } while ( ( i_chg_val < 0 ) && ( m_mock.i_price < 2 ) );

      m_mock.i_price += i_chg_val;
      m_mock.d_lastUpdate = new Date( );
      this.displayPriceLastUpdate( this.iMockIter );

      if ( ( this.iSortedField == Constants.MOCK_FIELD_INDEX_3 ) ||
         ( this.iSortedField == Constants.MOCK_FIELD_INDEX_4 ) ) {
         this.sortMockData( );
      }

      ++this.iMockIter;
   }

   onRunClicked( ) {
      var cb = document.getElementById( "chkBxRun" );
      var callback = this;

      if ( cb.checked ) {
         this.iMockIter = 0;
         this.iIntervalID = setInterval( function ( ) { callback.onRunInterval( ); }, Constants.RUNTIME_INTERVALIN_MS );
      }
      else {
         clearInterval( this.iIntervalID );
         this.iIntervalID = null;
      }
   }
}

function onChkBx( i_index ) {
   g_s.onCheckBoxClick( i_index );
}

function onSort( i_index ) {
   g_s.onSortSelected( i_index );
}

function onRun( ) {
   g_s.onRunClicked( );
}

function main( ) {
   g_s = new Solution( );
}

function unload( ) {
}
