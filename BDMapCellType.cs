using GrapeCity.Forguncy.CellTypes;
using GrapeCity.Forguncy.Plugin;
using System;
using System.ComponentModel;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace BDMapCellType
{
    [Icon("pack://application:,,,/BDMapCellType;component/Resources/Icon.png")]
    [SupportLanguageScope(LanguageScope.Chinese)]
    [SupportUsingScope(PageScope.AllPage, ListViewScope.None)]
    public class BDMapCellType : CellType
    {
        public BDMapCellType()
        {
            Longitude = 116.404;
            Latitude = 39.915;
            Zoom = 15;
            Position = true;
            Distance = false;
            ReadOnly = false;
        }


        [ResourcesCategoryHeader("BDMapCellType_Options")]
        [ResourcesDisplayName("Longitude")]
        
        [OrderWeight(1)]
        [DefaultValue(116.404)]
        public double Longitude
        {
            get;
            set;
        }

        [ResourcesDisplayName("Latitude")]
        
        [OrderWeight(2)]
        [DefaultValue(39.915)]
        public double Latitude
        {
            get;
            set;
        }     

        [ResourcesDisplayName("Zoom")]
        [ResourcesDescription("Zoom_Description")]
        [OrderWeight(3)]
        [DefaultValue(15)]
        public int Zoom
        {
            get;
            set;
        }

        [ResourcesCategoryHeader("BDMapCellType_Others")]
        [ResourcesDisplayName("BMapCellType_Positioning")]
        
        [OrderWeight(4)]
        [DefaultValue(true)]

        public bool Position
        {
            get;
            set;
        }

        [ResourcesDisplayName("BMapCellType_Distance")]
        [ResourcesDescription("BMapCellType_Distance_Description")]
        [OrderWeight(5)]
        [DefaultValue(false)]

        public bool Distance
        {
            get;
            set;
        }

        [ResourcesDisplayName("BMapCellType_ReadOnly")]

        [OrderWeight(6)]
        [DefaultValue(false)]

        public bool ReadOnly
        {
            get;
            set;
        }
        public override FrameworkElement GetDrawingControl(ICellInfo cellInfo, IDrawingHelper drawingHelper)
        {
            Grid grid = new Grid();
            Image image = new Image();
            image.Source = new BitmapImage(new Uri("pack://application:,,,/BDMapCellType;component/Resources/Preview.png", UriKind.RelativeOrAbsolute));
            image.Stretch = Stretch.Uniform;
            image.VerticalAlignment = VerticalAlignment.Center;
            image.HorizontalAlignment = HorizontalAlignment.Center;

            grid.Children.Add(image);
            return grid;
        }

        public override string ToString()
        {
            return Resource.BMapCellType_DisplayName;
        }
    }
    public class ResourcesCategoryHeaderAttribute : CategoryHeaderAttribute
    {
        public ResourcesCategoryHeaderAttribute(string categoryHeader)
        : base(categoryHeader) { }

        public override string CategoryHeader
        {
            get
            {
                return Resource.ResourceManager.GetString(base.CategoryHeader);
            }
        }
    }

    public class ResourcesDisplayNameAttribute : DisplayNameAttribute
    {
        public ResourcesDisplayNameAttribute(string displayName)
            : base(displayName) { }
        public override string DisplayName
        {
            get
            {
                return Resource.ResourceManager.GetString(base.DisplayName);
            }
        }
    }

    public class ResourcesDescriptionAttribute : DescriptionAttribute
    {
        public ResourcesDescriptionAttribute(string description) : base(description) { }

        public override string Description
        {
            get
            {
                return Resource.ResourceManager.GetString(base.Description);
            }
        }
    }
}
