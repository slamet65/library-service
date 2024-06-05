import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBookDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    title: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    author: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    stock: number;
}