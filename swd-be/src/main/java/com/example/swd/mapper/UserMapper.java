package com.example.swd.mapper;

import com.example.swd.dto.request.UserCreationRequest;
import com.example.swd.dto.request.UserUpdateRequest;
import com.example.swd.dto.response.UserResponse;
import com.example.swd.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    @Mapping(target = "roles", ignore = true)
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    List<UserResponse> toUserResponse(List<User> users);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
