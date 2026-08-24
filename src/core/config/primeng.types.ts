import type { ElementRef, TemplateRef } from '@angular/core';
import type { OverlayOptions, PassThroughOptions, Translation } from '@selisedev/primus-beta/core/api';
import type { AccordionPassThrough } from '@selisedev/primus-beta/core/types/accordion';
import type { AutoCompletePassThrough } from '@selisedev/primus-beta/core/types/autocomplete';
import type { AvatarPassThrough } from '@selisedev/primus-beta/core/types/avatar';
import type { AvatarGroupPassThrough } from '@selisedev/primus-beta/core/types/avatargroup';
import type { BadgePassThrough } from '@selisedev/primus-beta/core/types/badge';
import type { BlockUIPassThrough } from '@selisedev/primus-beta/core/types/blockui';
import type { BreadcrumbPassThrough } from '@selisedev/primus-beta/core/types/breadcrumb';
import type { ButtonPassThrough } from '@selisedev/primus-beta/core/types/button';
import type { CardPassThrough } from '@selisedev/primus-beta/core/types/card';
import type { CarouselPassThrough } from '@selisedev/primus-beta/core/types/carousel';
import type { CascadeSelectPassThrough } from '@selisedev/primus-beta/core/types/cascadeselect';
import type { CheckboxPassThrough } from '@selisedev/primus-beta/core/types/checkbox';
import type { ChipPassThrough } from '@selisedev/primus-beta/core/types/chip';
import type { ColorPickerPassThrough } from '@selisedev/primus-beta/core/types/colorpicker';
import type { ConfirmDialogPassThrough } from '@selisedev/primus-beta/core/types/confirmdialog';
import type { ConfirmPopupPassThrough } from '@selisedev/primus-beta/core/types/confirmpopup';
import type { DialogPassThrough } from '@selisedev/primus-beta/core/types/dialog';
import type { DividerPassThrough } from '@selisedev/primus-beta/core/types/divider';
import type { DockPassThrough } from '@selisedev/primus-beta/core/types/dock';
import type { DrawerPassThrough } from '@selisedev/primus-beta/core/types/drawer';
import type { EditorPassThrough } from '@selisedev/primus-beta/core/types/editor';
import type { FieldsetPassThrough } from '@selisedev/primus-beta/core/types/fieldset';
import type { FileUploadPassThrough } from '@selisedev/primus-beta/core/types/fileupload';
import type { FloatLabelPassThrough } from '@selisedev/primus-beta/core/types/floatlabel';
import type { FluidPassThrough } from '@selisedev/primus-beta/core/types/fluid';
import type { GalleriaPassThrough } from '@selisedev/primus-beta/core/types/galleria';
import type { IconFieldPassThrough } from '@selisedev/primus-beta/core/types/iconfield';
import type { IftaLabelPassThrough } from '@selisedev/primus-beta/core/types/iftalabel';
import type { ImagePassThrough } from '@selisedev/primus-beta/core/types/image';
import type { ImageComparePassThrough } from '@selisedev/primus-beta/core/types/imagecompare';
import type { InplacePassThrough } from '@selisedev/primus-beta/core/types/inplace';
import type { InputGroupPassThrough } from '@selisedev/primus-beta/core/types/inputgroup';
import type { InputGroupAddonPassThrough } from '@selisedev/primus-beta/core/types/inputgroupaddon';
import type { InputIconPassThrough } from '@selisedev/primus-beta/core/types/inputicon';
import type { InputMaskPassThrough } from '@selisedev/primus-beta/core/types/inputmask';
import type { InputNumberPassThrough } from '@selisedev/primus-beta/core/types/inputnumber';
import type { InputOtpPassThrough } from '@selisedev/primus-beta/core/types/inputotp';
import type { InputTextPassThrough } from '@selisedev/primus-beta/core/types/inputtext';
import type { KnobPassThrough } from '@selisedev/primus-beta/core/types/knob';
import type { MegaMenuPassThrough } from '@selisedev/primus-beta/core/types/megamenu';
import type { MenuPassThrough } from '@selisedev/primus-beta/core/types/menu';
import type { MenubarPassThrough } from '@selisedev/primus-beta/core/types/menubar';
import type { MessagePassThrough } from '@selisedev/primus-beta/core/types/message';
import type { MeterGroupPassThrough } from '@selisedev/primus-beta/core/types/metergroup';
import type { OrderListPassThrough } from '@selisedev/primus-beta/core/types/orderlist';
import type { OrganizationChartPassThrough } from '@selisedev/primus-beta/core/types/organizationchart';
import type { OverlayBadgePassThrough } from '@selisedev/primus-beta/core/types/overlaybadge';
import type { PanelPassThrough } from '@selisedev/primus-beta/core/types/panel';
import type { PanelMenuPassThrough } from '@selisedev/primus-beta/core/types/panelmenu';
import type { PopoverPassThrough } from '@selisedev/primus-beta/core/types/popover';
import type { ProgressBarPassThrough } from '@selisedev/primus-beta/core/types/progressbar';
import type { ProgressSpinnerPassThrough } from '@selisedev/primus-beta/core/types/progressspinner';
import type { RadioButtonPassThrough } from '@selisedev/primus-beta/core/types/radiobutton';
import type { RatingPassThrough } from '@selisedev/primus-beta/core/types/rating';
import type { VirtualScrollerPassThrough } from '@selisedev/primus-beta/core/types/scroller';
import type { ScrollPanelPassThrough } from '@selisedev/primus-beta/core/types/scrollpanel';
import type { ScrollTopPassThrough } from '@selisedev/primus-beta/core/types/scrolltop';
import type { SelectPassThrough } from '@selisedev/primus-beta/core/types/select';
import type { SelectButtonPassThrough } from '@selisedev/primus-beta/core/types/selectbutton';
import type { SkeletonPassThrough } from '@selisedev/primus-beta/core/types/skeleton';
import type { SliderPassThrough } from '@selisedev/primus-beta/core/types/slider';
import type { SpeedDialPassThrough } from '@selisedev/primus-beta/core/types/speeddial';
import type { SplitButtonPassThrough } from '@selisedev/primus-beta/core/types/splitbutton';
import type { SplitterPassThrough } from '@selisedev/primus-beta/core/types/splitter';
import type { StepperPassThrough } from '@selisedev/primus-beta/core/types/stepper';
import type { ColumnFilterPassThrough, TablePassThrough } from '@selisedev/primus-beta/core/types/table';
import type { TabListPassThrough, TabPanelPassThrough, TabPanelsPassThrough, TabPassThrough, TabsPassThrough } from '@selisedev/primus-beta/core/types/tabs';
import type { TagPassThrough } from '@selisedev/primus-beta/core/types/tag';
import type { TerminalPassThrough } from '@selisedev/primus-beta/core/types/terminal';
import type { TieredMenuPassThrough } from '@selisedev/primus-beta/core/types/tieredmenu';
import type { TimelinePassThrough } from '@selisedev/primus-beta/core/types/timeline';
import type { ToastPassThrough } from '@selisedev/primus-beta/core/types/toast';
import type { ToggleButtonPassThrough } from '@selisedev/primus-beta/core/types/togglebutton';
import type { ToggleSwitchPassThrough } from '@selisedev/primus-beta/core/types/toggleswitch';
import type { ToolbarPassThrough } from '@selisedev/primus-beta/core/types/toolbar';
import type { TreePassThrough } from '@selisedev/primus-beta/core/types/tree';
import type { TreeSelectPassThrough } from '@selisedev/primus-beta/core/types/treeselect';
import type { TreeTablePassThrough } from '@selisedev/primus-beta/core/types/treetable';

/** ZIndex configuration */
export type ZIndex = {
    modal: number;
    overlay: number;
    menu: number;
    tooltip: number;
};

/** Theme configuration */
export type ThemeType = { preset?: any; options?: any } | 'none' | boolean | undefined;

export type ThemeConfigType = {
    theme?: ThemeType;
    csp?: {
        nonce: string | undefined;
    };
};

export interface GlobalPassThrough {
    accordion?: AccordionPassThrough;
    autoComplete?: AutoCompletePassThrough;
    avatar?: AvatarPassThrough;
    avatarGroup?: AvatarGroupPassThrough;
    blockUI?: BlockUIPassThrough;
    breadcrumb?: BreadcrumbPassThrough;
    card?: CardPassThrough;
    carousel?: CarouselPassThrough;
    cascadeSelect?: CascadeSelectPassThrough;
    checkbox?: CheckboxPassThrough;
    chip?: ChipPassThrough;
    colorPicker?: ColorPickerPassThrough;
    columnFilter?: ColumnFilterPassThrough;
    confirmDialog?: ConfirmDialogPassThrough;
    confirmPopup?: ConfirmPopupPassThrough;
    dialog?: DialogPassThrough;
    divider?: DividerPassThrough;
    dock?: DockPassThrough;
    megaMenu?: MegaMenuPassThrough;
    drawer?: DrawerPassThrough;
    editor?: EditorPassThrough;
    fileUpload?: FileUploadPassThrough;
    floatLabel?: FloatLabelPassThrough;
    menu?: MenuPassThrough;
    menubar?: MenubarPassThrough;
    fluid?: FluidPassThrough;
    galleria?: GalleriaPassThrough;
    iconField?: IconFieldPassThrough;
    iftaLabel?: IftaLabelPassThrough;
    inputIcon?: InputIconPassThrough;
    image?: ImagePassThrough;
    imageCompare?: ImageComparePassThrough;
    inplace?: InplacePassThrough;
    inputText?: InputTextPassThrough;
    inputGroup?: InputGroupPassThrough;
    inputGroupAddon?: InputGroupAddonPassThrough;
    inputMask?: InputMaskPassThrough;
    inputNumber?: InputNumberPassThrough;
    inputOtp?: InputOtpPassThrough;
    knob?: KnobPassThrough;
    popover?: PopoverPassThrough;
    message?: MessagePassThrough;
    meterGroup?: MeterGroupPassThrough;
    orderList?: OrderListPassThrough;
    organizationChart?: OrganizationChartPassThrough;
    overlayBadge?: OverlayBadgePassThrough;
    progressBar?: ProgressBarPassThrough;
    progressSpinner?: ProgressSpinnerPassThrough;
    radioButton?: RadioButtonPassThrough;
    rating?: RatingPassThrough;
    virtualScroller?: VirtualScrollerPassThrough;
    scrollPanel?: ScrollPanelPassThrough;
    scrollTop?: ScrollTopPassThrough;
    select?: SelectPassThrough;
    selectButton?: SelectButtonPassThrough;
    skeleton?: SkeletonPassThrough;
    slider?: SliderPassThrough;
    speedDial?: SpeedDialPassThrough;
    splitButton?: SplitButtonPassThrough;
    splitter?: SplitterPassThrough;
    stepper?: StepperPassThrough;
    tabs?: TabsPassThrough;
    tab?: TabPassThrough;
    tabList?: TabListPassThrough;
    tabPanel?: TabPanelPassThrough;
    tabPanels?: TabPanelsPassThrough;
    table?: TablePassThrough;
    tieredMenu?: TieredMenuPassThrough;
    timeline?: TimelinePassThrough;
    tag?: TagPassThrough;
    terminal?: TerminalPassThrough;
    toast?: ToastPassThrough;
    toggleButton?: ToggleButtonPassThrough;
    toggleSwitch?: ToggleSwitchPassThrough;
    toolbar?: ToolbarPassThrough;
    tree?: TreePassThrough;
    treeSelect?: TreeSelectPassThrough;
    treeTable?: TreeTablePassThrough;
    panel?: PanelPassThrough;
    panelMenu?: PanelMenuPassThrough;
    button?: ButtonPassThrough;
    badge?: BadgePassThrough;
    fieldset?: FieldsetPassThrough;
    global?: {
        css?: string;
    };
    [key: string]: any;
}

export type PrimeNGConfigType = {
    ripple?: boolean;
    overlayAppendTo?: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
    /**
     * @deprecated Since v20. Use `inputVariant` instead.
     */
    inputStyle?: 'outlined' | 'filled';
    inputVariant?: 'outlined' | 'filled';
    overlayOptions?: OverlayOptions;
    translation?: Translation;
    /**
     * @experimental
     * This property is not yet implemented. It will be available in a future release.
     */
    unstyled?: boolean;
    zIndex?: ZIndex | null | undefined;
    pt?: GlobalPassThrough | null | undefined;
    ptOptions?: PassThroughOptions | null | undefined;
    filterMatchModeOptions?: any;
} & ThemeConfigType;
