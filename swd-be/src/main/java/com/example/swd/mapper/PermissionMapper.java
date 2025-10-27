package com.example.swd.mapper;

import com.example.swd.dto.request.PermissionRequest;
import com.example.swd.dto.response.PermissionResponse;
import com.example.swd.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
